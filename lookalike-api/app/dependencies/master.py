from typing import Annotated
from fastapi import Depends
from sqlalchemy.orm import Session

from app.dependencies.database import get_db
from app.managers.database_manager import DatabaseManager
from app.services.recommender_service import Recommender


def get_database_manager(db: Annotated[Session, Depends(get_db)]) -> DatabaseManager:
    return DatabaseManager(db)


def get_recommender(
    database_manager: Annotated[DatabaseManager, Depends(get_database_manager)],
) -> Recommender:
    return Recommender(database_manager)