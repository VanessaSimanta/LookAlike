from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload
from app.models.product import Product
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