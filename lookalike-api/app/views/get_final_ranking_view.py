from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.dependencies.master import get_recommender
from app.errors.product_not_found import ProductNotFoundError
from app.mappers.get_final_ranking_mapper import get_final_ranking_mapper
from app.schemas.request.get_final_ranking_request import GetFinalRankingRequestSchema
from app.schemas.response.get_final_ranking_response import GetFinalRankingResponse
from app.services.recommender_service import Recommender

router = APIRouter(tags=["Products"])


@router.get("/final-ranking", response_model=list[GetFinalRankingResponse])
def get_final_ranking_view(
    query: Annotated[GetFinalRankingRequestSchema, Query()],
    recommender: Annotated[Recommender, Depends(get_recommender)],
):
    try:
        products = recommender.get_final_ranking(query.product_ids)
    except ProductNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    return [get_final_ranking_mapper(product) for product in products]