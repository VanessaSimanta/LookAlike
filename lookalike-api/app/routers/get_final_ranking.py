from typing import Annotated
from fastapi import APIRouter, Depends, Query

from app.dependencies.master import get_final_ranking_use_case
from app.mappers.get_final_ranking_mapper import get_final_ranking_mapper
from app.schemas.request.get_final_ranking_request import GetFinalRankingRequestSchema
from app.schemas.response.get_final_ranking_response import GetFinalRankingResponse
from app.schemas.response.standard_response import StandardResponse
from app.usecase.get_final_ranking_usecase import GetFinalRankingUseCase
from app.utils.standard_response import StandardResponseBuilder

router = APIRouter(tags=["Products"])


@router.get(
    "/final-ranking",
    response_model=StandardResponse[list[GetFinalRankingResponse]],
)
def get_final_ranking(
    query: Annotated[GetFinalRankingRequestSchema, Query()],
    use_case: Annotated[GetFinalRankingUseCase, Depends(get_final_ranking_use_case)],
):
    products = use_case.execute(query.product_ids)

    print("products", products)
    return (
        StandardResponseBuilder()
        .set_data([get_final_ranking_mapper(product) for product in products])
        .build()
    )
