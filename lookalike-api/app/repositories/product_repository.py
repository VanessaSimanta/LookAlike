from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.product import Product


class ProductRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_ids(self, ids: list[int]) -> list[Product]:
        try:
            if not ids:
                return []

            query = select(Product).where(Product.id.in_(ids))

            return list(self.db.scalars(query).all())
        except Exception as e:
            print("Error in get_by_ids product repository:", e)
            raise e

    def get_by_id(self, id: int) -> Product:
        try:
            query = select(Product).where(Product.id == id)

            return self.db.scalars(query).one()
        except Exception as e:
            print("Error in get_by_id product repository:", e)
            raise e

    def get_random(
        self, limit: int, excluded_category_ids: list[int]
    ) -> list[Product]:
        try:
            query = select(Product)

            if excluded_category_ids:
                query = query.where(
                    Product.category_id.not_in(excluded_category_ids)
                )

            query = query.order_by(func.random()).limit(limit)

            return list(self.db.scalars(query).all())
        except Exception as e:
            print("Error in get_random product repository:", e)
            raise e
