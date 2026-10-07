from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload, load_only
from app.models.product import Product
from app.models.category import Category
from app.models.product_image import ProductImage


class DatabaseManager:
    def __init__(self, db: Session):
        self.db = db

    def get_products_by_ids(self, ids: list[int]) -> list[Product]:
        try:
            if not ids:
                return []

            query = (
                select(Product)
                .options(
                    joinedload(Product.brand),
                    joinedload(Product.category),
                    joinedload(Product.images).load_only(
                        ProductImage.url,
                    ),
                )
                .where(Product.id.in_(ids))
            )

            return list(self.db.scalars(query).unique().all())
        except Exception as e:
            print("Error in get_products_by_ids manager:", e)
            raise e

    def get_product_detail_by_id(self, id: int) -> Product:
        try:
            query = (
                select(Product)
                .options(
                    joinedload(Product.brand),
                    joinedload(Product.category),
                    joinedload(Product.images).load_only(
                        ProductImage.url,
                    ),
                )
                .where(Product.id == id)
            )

            return self.db.scalars(query).one()
        except Exception as e:
            print("Error in get_product_detail_by_id manager:", e)
            raise e

    def get_random_products(self, limit: int) -> list[Product]:
        try:
            query = (
                select(Product)
                .options(
                    joinedload(Product.category),
                    joinedload(Product.images).load_only(
                        ProductImage.url,
                    ),
                )
                .where(
                    ~Product.category.has(
                        Category.name.in_(
                            [
                                "Underwear",
                                "Lingerie",
                                "Other",
                            ]
                        )
                    )
                )
                .order_by(func.random())
                .limit(limit)
            )

            return list(self.db.scalars(query).unique().all())
        except Exception as e:
            print("Error in get_random_products manager:", e)
            raise e

    def get_all_feature_vectors(self) -> list[ProductImage]:
        try:
            query = (
                select(ProductImage)
                .options(
                    load_only(
                        ProductImage.product_id,
                        ProductImage.feature_vector,
                    )
                )
                .where(ProductImage.feature_vector.is_not(None))
                .order_by(ProductImage.id)
            )
            return list(self.db.scalars(query).all())
        except Exception as e:
            print("Error in get_all_feature_vectors manager:", e)
            raise e
