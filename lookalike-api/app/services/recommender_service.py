from typing import Optional

from fastapi import UploadFile
import numpy as np
from sqlalchemy.exc import NoResultFound
from sklearn.metrics.pairwise import cosine_similarity

from app.errors.product_not_found import ProductNotFoundError
from app.managers.database_manager import DatabaseManager
from app.schemas.response.get_final_ranking_response import GetFinalRankingResponse
from app.featureExtractor.feature_extractor import FeatureExtractor
from app.featureExtractor.feature_index import FeatureIndex
from app.enums.priority_enum import Priority

# Price Scoring 
PRICE_SCORE_LOWER_HALF_IN_RANGE = 20   
PRICE_SCORE_UPPER_HALF_IN_RANGE = 30   
PRICE_SCORE_BELOW_RANGE = 40           
PRICE_SCORE_ABOVE_RANGE = 50           

# Material Scoring 
MATERIAL_MATCH = 100
MATERIAL_NO_MATCH = 0

# SAW Weight
WEIGHT_SINGLE = 1.0
WEIGHT_PRIORITY = 0.6
WEIGHT_NON_PRIORITY = 0.4


class Recommender:
    def __init__(
        self,
        database_manager: DatabaseManager,
        feature_extractor: FeatureExtractor,
        feature_index: FeatureIndex,
    ):
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

    def get_random_sample(self, limit: int):
        return self.database_manager.get_random_products(limit)

    def _calculate_cosine_similarity(
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

    @staticmethod
    def _get_price(product) -> int:
        if product.brand.name == "Zara":
            return product.base_price
        elif product.promo_price is not None:
            return product.promo_price
        else:
            return product.base_price

    @staticmethod
    def _price_score(price: int, min_price: int, max_price: int) -> int:
        mid_price = (min_price + max_price) / 2

        if min_price <= price <= mid_price:
            return PRICE_SCORE_LOWER_HALF_IN_RANGE
        if mid_price < price <= max_price:
            return PRICE_SCORE_UPPER_HALF_IN_RANGE
        if price < min_price:
            return PRICE_SCORE_BELOW_RANGE
        return PRICE_SCORE_ABOVE_RANGE

    @staticmethod
    def _get_weights(
        use_price: bool, use_material: bool, priority: Optional[Priority]
    ) -> dict:
        if use_price and not use_material:
            return {"harga": WEIGHT_SINGLE, "bahan": 0.0}

        if use_material and not use_price:
            return {"harga": 0.0, "bahan": WEIGHT_SINGLE}

        if priority == Priority.PRICE:
            return {"harga": WEIGHT_PRIORITY, "bahan": WEIGHT_NON_PRIORITY}
        return {"harga": WEIGHT_NON_PRIORITY, "bahan": WEIGHT_PRIORITY}

    @staticmethod
    def _material_score(
        product_material: Optional[str], user_materials: list[str]
    ) -> int:
        if not product_material:
            return MATERIAL_NO_MATCH

        input_materials = {m.strip().lower() for m in user_materials}
        data = {m.strip().lower() for m in product_material.split(",")}
        return MATERIAL_MATCH if input_materials & data else MATERIAL_NO_MATCH

    def _calculate_simple_additive_weighting(
        self,
        candidates: list[tuple],
        min_price: Optional[int],
        max_price: Optional[int],
        materials: Optional[list[str]],
        priority: Optional[Priority],
    ) -> list[dict]:
        use_price = min_price is not None and max_price is not None
        use_material = bool(materials)
        weights = self._get_weights(use_price, use_material, priority)

        rows = []
        for product, similarity in candidates:
            rows.append(
                {
                    "product": product,
                    "similarity": similarity,
                    "price_score": self._price_score(
                        self._get_price(product), min_price, max_price
                    )
                    if use_price
                    else None,
                    "material_score": self._material_score(
                        product.material, materials
                    )
                    if use_material
                    else None,
                }
            )

        if use_price:
            min_price_score = min(r["price_score"] for r in rows)
            for r in rows:
                r["price_norm"] = min_price_score / r["price_score"]

        if use_material:
            max_material_score = max(r["material_score"] for r in rows)
            for r in rows:
                r["material_norm"] = (
                    r["material_score"] / max_material_score
                    if max_material_score > 0
                    else 0.0
                )

        for r in rows:
            total = 0.0
            if use_price:
                total += weights["harga"] * r["price_norm"]
            if use_material:
                total += weights["bahan"] * r["material_norm"]
            r["saw_score"] = total

        rows.sort(key=lambda r: (r["saw_score"], r["similarity"]), reverse=True)
        return rows

    def find_similar_products(
        self,
        image: UploadFile,
        min_price: Optional[int] = None,
        max_price: Optional[int] = None,
        materials: Optional[list[str]] = None,
        priority: Optional[Priority] = None,
    ):
        image_bytes = image.file.read()
        query_vector = self.feature_extractor.extract(image_bytes)

        top_10 = self._calculate_cosine_similarity(query_vector, k=10)

        product_ids = [product_id for product_id, _ in top_10]
        products = self.database_manager.get_products_by_ids(product_ids)
        product_map = {product.id: product for product in products}

        candidates = [
            (product_map[pid], score) for pid, score in top_10 if pid in product_map
        ]

        has_price = min_price is not None and max_price is not None
        has_material = bool(materials)

        if not has_price and not has_material:
            return [
                {"product": p, "similarity": s, "saw_score": None}
                for p, s in candidates
            ]

        return self._calculate_simple_additive_weighting(
            candidates, min_price, max_price, materials, priority
        )