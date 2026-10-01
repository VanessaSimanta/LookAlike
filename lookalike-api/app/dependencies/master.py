from typing import Annotated
from fastapi import Depends
from functools import lru_cache

from sqlalchemy.orm import Session

from app.dependencies.database import SessionLocal, get_db
from app.featureExtractor.feature_extractor import FeatureExtractor
from app.featureExtractor.feature_index import FeatureIndex
from app.managers.database_manager import DatabaseManager
from app.services.recommender_service import Recommender


def get_database_manager(db: Annotated[Session, Depends(get_db)]) -> DatabaseManager:
    return DatabaseManager(db)


@lru_cache
def get_feature_extractor() -> FeatureExtractor:
    return FeatureExtractor()


@lru_cache
def get_feature_index() -> FeatureIndex:
    db = SessionLocal()
    try:
        rows = DatabaseManager(db).get_all_feature_vectors()
    finally:
        db.close()
    return FeatureIndex.from_rows(rows)


def get_recommender(
    db: Session = Depends(get_db),
    feature_extractor: FeatureExtractor = Depends(get_feature_extractor),
    feature_index: FeatureIndex = Depends(get_feature_index),
) -> Recommender:
    return Recommender(DatabaseManager(db), feature_extractor, feature_index)