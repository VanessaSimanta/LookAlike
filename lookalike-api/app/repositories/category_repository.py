from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.category import Category


class CategoryRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_ids(self, ids: list[int]) -> list[Category]:
        try:
            if not ids:
                return []

            query = select(Category).where(Category.id.in_(ids))

            return list(self.db.scalars(query).all())
        except Exception as e:
            print("Error in get_by_ids category repository:", e)
            raise e

    def get_ids_by_names(self, names: list[str]) -> list[int]:
        try:
            if not names:
                return []

            query = select(Category.id).where(Category.name.in_(names))

            return list(self.db.scalars(query).all())
        except Exception as e:
            print("Error in get_ids_by_names category repository:", e)
            raise e
