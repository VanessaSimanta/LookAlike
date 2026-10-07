from typing import Annotated
from fastapi import APIRouter, Depends, Query

from app.dependencies.master import get_recommender
from app.mappers.get_random_sample_mapper import get_random_sample_mapper
from app.schemas.request.get_random_sample_request import GetRandomSampleRequestSchema
from app.schemas.response.get_random_sample_response import GetRandomSampleResponse
from app.schemas.response.standard_response import StandardResponse
from app.services.recommender_service import Recommender
from app.utils.standard_response import StandardResponseBuilder

router = APIRouter(tags=["Products"])


@router.get(
    "/random-sample",
    response_model=StandardResponse[list[GetRandomSampleResponse]],
)
def get_random_sample_view(
    query: Annotated[GetRandomSampleRequestSchema, Query()],
    recommender: Annotated[Recommender, Depends(get_recommender)],
):
    products = recommender.get_random_sample(query.limit)
    return (
        StandardResponseBuilder()
        .set_data([get_random_sample_mapper(product) for product in products])
        .build()
    )
