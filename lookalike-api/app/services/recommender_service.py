from fastapi import UploadFile
import numpy as np
from sqlalchemy.exc import NoResultFound
from sklearn.metrics.pairwise import cosine_similarity

from app.errors.product_not_found import ProductNotFoundError
from app.managers.database_manager import DatabaseManager
from app.schemas.response.get_final_ranking_response import GetFinalRankingResponse
from app.featureExtractor.feature_extractor import FeatureExtractor
from app.featureExtractor.feature_index import FeatureIndex


class Recommender:
    def __init__(self, database_manager: DatabaseManager, feature_extractor: FeatureExtractor, feature_index: FeatureIndex):
        self.database_manager = database_manager
        self.feature_extractor = feature_extractor
        self.feature_index = feature_index

    def get_final_ranking(
        self, product_ids: list[int]
    ) -> list[GetFinalRankingResponse]:
        return self.database_manager.get_products_by_ids(product_ids)

    def get_product_detail(self, product_id: int) -> GetFinalRankingResponse:
        try:
            return self.database_manager.get_product_detail_by_id(product_id)
        except NoResultFound:
            raise ProductNotFoundError([product_id])

    def retrieve_top_k(
        self, query_vector: np.ndarray, k: int 
    ) -> list[tuple[int, float]]:
        similarities = cosine_similarity(
            query_vector, self.feature_index.feature_vectors
        )[0]

        sorted_idx = np.argsort(similarities)[::-1]

        top_k = []
        seen = set()

        for idx in sorted_idx:
            product_id = int(self.feature_index.product_ids[idx])

            if product_id in seen:
                continue

            seen.add(product_id)
            top_k.append((product_id, float(similarities[idx])))

            if len(top_k) == k:
                break
            
        return top_k

    def find_similar_products(
        self, image: UploadFile, min_price, max_price, materials, priority
    ):
        image_bytes = image.file.read()
        query_vector = self.feature_extractor.extract(image_bytes)

        top_10 = self.retrieve_top_k(query_vector, k=10)

        product_ids = [product_id for product_id, _ in top_10]
        products = self.database_manager.get_products_by_ids(product_ids)
        product_map = {product.id: product for product in products}

        results = []

        for product_id, similarity_score in top_10:
            product = product_map.get(product_id)

            if product is None:
                continue

            results.append((product, similarity_score))

        return results
