from fastapi import Depends
from functools import lru_cache

from sqlalchemy.orm import Session

from app.dependencies.database import SessionLocal, get_db
from app.featureExtractor.feature_extractor import FeatureExtractor
from app.featureExtractor.feature_index import FeatureIndex
from app.repositories.brand_repository import BrandRepository
from app.repositories.category_repository import CategoryRepository
from app.repositories.product_image_repository import ProductImageRepository
from app.repositories.product_repository import ProductRepository
from app.usecase.get_final_ranking_usecase import GetFinalRankingUseCase
from app.usecase.get_product_detail_usecase import GetProductDetailUseCase
from app.usecase.get_random_sample_usecase import GetRandomSampleUseCase
from app.usecase.get_sample_image_usecase import GetSampleImageUseCase
from app.usecase.get_similar_products_usecase import GetSimilarProductsUseCase


@lru_cache
def get_feature_extractor() -> FeatureExtractor:
    return FeatureExtractor()


@lru_cache
def get_feature_index() -> FeatureIndex:
    db = SessionLocal()
    try:
        rows = ProductImageRepository(db).get_all_feature_vectors()
    finally:
        db.close()
    return FeatureIndex.from_rows(rows)


def get_final_ranking_use_case(
    db: Session = Depends(get_db),
) -> GetFinalRankingUseCase:
    return GetFinalRankingUseCase(
        product_repository=ProductRepository(db),
        brand_repository=BrandRepository(db),
        category_repository=CategoryRepository(db),
        product_image_repository=ProductImageRepository(db),
    )


def get_product_detail_use_case(
    db: Session = Depends(get_db),
) -> GetProductDetailUseCase:
    return GetProductDetailUseCase(
        product_repository=ProductRepository(db),
        brand_repository=BrandRepository(db),
        category_repository=CategoryRepository(db),
        product_image_repository=ProductImageRepository(db),
    )


def get_random_sample_use_case(
    db: Session = Depends(get_db),
) -> GetRandomSampleUseCase:
    return GetRandomSampleUseCase(
        product_repository=ProductRepository(db),
        category_repository=CategoryRepository(db),
        product_image_repository=ProductImageRepository(db),
    )


def get_sample_image_use_case(
    db: Session = Depends(get_db),
) -> GetSampleImageUseCase:
    return GetSampleImageUseCase(
        product_image_repository=ProductImageRepository(db),
    )


def get_similar_products_use_case(
    db: Session = Depends(get_db),
    feature_extractor: FeatureExtractor = Depends(get_feature_extractor),
    feature_index: FeatureIndex = Depends(get_feature_index),
) -> GetSimilarProductsUseCase:
    return GetSimilarProductsUseCase(
        product_repository=ProductRepository(db),
        brand_repository=BrandRepository(db),
        category_repository=CategoryRepository(db),
        product_image_repository=ProductImageRepository(db),
        feature_extractor=feature_extractor,
        feature_index=feature_index,
    )
