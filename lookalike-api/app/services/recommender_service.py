from sqlalchemy.exc import NoResultFound

from app.errors.product_not_found import ProductNotFoundError
from app.managers.database_manager import DatabaseManager
from app.schemas.response.get_final_ranking_response import GetFinalRankingResponse


class Recommender:
    def __init__(self, database_manager: DatabaseManager):
        self.database_manager = database_manager

    def get_final_ranking(self, product_ids: list[int]) -> list[GetFinalRankingResponse]:
        return self.database_manager.get_products_by_ids(product_ids)

    def get_product_detail(self, product_id: int) -> GetFinalRankingResponse:
        try:
            return self.database_manager.get_product_detail_by_id(product_id)
        except NoResultFound:
            raise ProductNotFoundError([product_id])

    def find_similar_products():
        ...
    
       