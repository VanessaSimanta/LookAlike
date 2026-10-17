import argparse
import os
import re

import numpy as np
import pandas as pd
from sqlalchemy import select, text

from app.dependencies.database import SessionLocal
from app.models import Brand, Category, Product, ProductImage

BRANDS = ["Uniqlo", "H&M", "Marks & Spencer", "Zara"]

CATEGORIES = [
    "T-shirt", "Tank Top", "Polo", "Shirt & Blouse", "Sweater & Cardigan",
    "Sweatshirt", "Jacket", "Blazer", "Jeans", "Trouser", "Short", "Skirt",
    "Legging", "Dress", "Jumpsuit & Set", "Swimwear", "Underwear", "Lingerie",
    "Top", "Other",
]

VECTOR_DIM = 1280
BATCH_SIZE = 500

LIST_SEPARATOR = re.compile(r"\s*[|,]\s*")

def to_list(value):
    if pd.isna(value):
        return None
    items = [s.strip() for s in LIST_SEPARATOR.split(str(value)) if s.strip()]
    return items or None

def to_number(value):
    return None if pd.isna(value) else float(value)

def to_text(value):
    if pd.isna(value):
        return None
    value = str(value).strip()
    return value or None

def get_or_create(session, model, name):
    obj = session.scalar(select(model).where(model.name == name))
    if obj is None:
        obj = model(name=name)
        session.add(obj)
        session.flush()  
    return obj

def load_data(csv_path, npy_path):
    df = pd.read_csv(csv_path, dtype={"product_id": str})
    vectors = np.load(npy_path)

    if len(df) != len(vectors):
        raise SystemExit(
            f"Jumlah baris CSV ({len(df)}) != jumlah vektor ({len(vectors)}). "
            "Pastikan CSV yang dipakai sama dengan saat ekstraksi fitur."
        )
    if vectors.ndim != 2 or vectors.shape[1] != VECTOR_DIM:
        raise SystemExit(f"Shape vektor {vectors.shape}, seharusnya (N, {VECTOR_DIM})")
    if np.isnan(vectors).any():
        raise SystemExit("Ada nilai NaN di feature_vectors.npy")
    if df["product_id"].duplicated().any():
        raise SystemExit("Ada product_id duplikat di CSV")

    if df["image_full_path"].isna().any():
        missing = df.index[df["image_full_path"].isna()].tolist()
        raise SystemExit(f"Ada baris tanpa image_full_path (gambar tidak ditemukan): {missing[:10]}")

    unknown_brand = set(df["brand"]) - set(BRANDS)
    unknown_cat = set(df["category"]) - set(CATEGORIES)
    if unknown_brand or unknown_cat:
        raise SystemExit(
            f"Brand tidak dikenal: {unknown_brand or '-'} | "
            f"Kategori tidak dikenal: {unknown_cat or '-'}"
        )
    return df, vectors

def seed(csv_path, npy_path):
    df, vectors = load_data(csv_path, npy_path)
    session = SessionLocal()
    try:
        brand_ids = {b: get_or_create(session, Brand, b).id for b in BRANDS}
        category_ids = {c: get_or_create(session, Category, c).id for c in CATEGORIES}

        existing_codes = set(session.scalars(select(Product.product_code)))

        inserted = skipped_existing = 0
        for i, row in enumerate(df.itertuples(index=False)):
            if row.product_id in existing_codes:
                skipped_existing += 1
                continue

            product = Product(
                brand_id=brand_ids[row.brand],
                category_id=category_ids[row.category],
                product_code=row.product_id,
                name=row.name.strip(),
                base_price=float(row.base_price),
                promo_price=to_number(row.promo_price),
                discount_percent=to_number(row.discount_percent),
                rating=to_number(row.rating),
                colors=to_list(row.colors),
                sizes=to_list(row.sizes),
                material=row.materials.strip(),
                description=to_text(row.description),
            )
            product.images.append(
                ProductImage(
                    local_path=os.path.basename(row.image_local_path),
                    url=row.image_url,
                    feature_vector=vectors[i],  
                )
            )
            session.add(product)
            existing_codes.add(row.product_id)
            inserted += 1

            if inserted % BATCH_SIZE == 0:
                session.flush()
                print(f"  {inserted} produk diproses...")

        session.commit()  
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()

    print("\nSelesai.")
    print(f"  Produk baru          : {inserted}")
    print(f"  Sudah ada (dilewati) : {skipped_existing}")


def summary():
    with SessionLocal() as s:
        q = text("""
            SELECT b.name AS brand, COUNT(p.id) AS jumlah
            FROM brand b LEFT JOIN product p ON p.brand_id = b.id
            GROUP BY b.id, b.name ORDER BY b.id
        """)
        print("\nJumlah produk per brand:")
        for r in s.execute(q):
            print(f"  {r.brand:<18}{r.jumlah}")
        n_img = s.execute(text("SELECT COUNT(*) FROM product_image")).scalar()
        print(f"Total product_image: {n_img}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Seed database LookAlike")
    parser.add_argument("--csv", default="data/df_clean.csv")
    parser.add_argument("--npy", default="data/feature_vectors.npy")
    args = parser.parse_args()
    seed(args.csv, args.npy)
    summary()