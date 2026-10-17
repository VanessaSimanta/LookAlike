from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.brand import Brand


class BrandRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_ids(self, ids: list[int]) -> list[Brand]:
        try:
            if not ids:
                return []

            query = select(Brand).where(Brand.id.in_(ids))

            return list(self.db.scalars(query).all())
        except Exception as e:
            print("Error in get_by_ids brand repository:", e)
            raise e
