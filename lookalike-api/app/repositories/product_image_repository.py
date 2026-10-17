from sqlalchemy import select
from sqlalchemy.orm import Session, load_only

from app.models.product_image import ProductImage


class ProductImageRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_product_ids(self, product_ids: list[int]) -> list[ProductImage]:
        try:
            if not product_ids:
                return []

            query = (
                select(ProductImage)
                .options(
                    load_only(
                        ProductImage.product_id,
                        ProductImage.url,
                    )
                )
                .where(ProductImage.product_id.in_(product_ids))
            )

            return list(self.db.scalars(query).all())
        except Exception as e:
            print("Error in get_by_product_ids product image repository:", e)
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
            print("Error in get_all_feature_vectors product image repository:", e)
            raise e
