from typing import Annotated
from fastapi import APIRouter, Depends, Query

from app.dependencies.master import get_recommender
from app.mappers.get_final_ranking_mapper import get_final_ranking_mapper
from app.schemas.request.get_final_ranking_request import GetFinalRankingRequestSchema
from app.schemas.response.get_final_ranking_response import GetFinalRankingResponse
from app.schemas.response.standard_response import StandardResponse
from app.services.recommender_service import Recommender
from app.utils.standard_response import StandardResponseBuilder

router = APIRouter(tags=["Products"])


@router.get(
    "/final-ranking",
    response_model=StandardResponse[list[GetFinalRankingResponse]],
)
def get_final_ranking_view(
    query: Annotated[GetFinalRankingRequestSchema, Query()],
    recommender: Annotated[Recommender, Depends(get_recommender)],
):
    products = recommender.get_final_ranking(query.product_ids)

    print("products", products)
    return (
        StandardResponseBuilder()
        .set_data([get_final_ranking_mapper(product) for product in products])
        .build()
    )
