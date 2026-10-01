from typing import Annotated
from fastapi import APIRouter, Depends, Query

from app.dependencies.master import get_recommender
from app.mappers.get_product_detail_mapper import get_product_detail_mapper
from app.schemas.request.get_product_detail_request import GetProductDetailRequestSchema
from app.schemas.response.get_product_detail_response import GetProductDetailResponse
from app.services.recommender_service import Recommender

router = APIRouter(tags=["Products"])


@router.get("/product-detail", response_model=GetProductDetailResponse)
def get_product_detail_view(
    query: Annotated[GetProductDetailRequestSchema, Query()],
    recommender: Annotated[Recommender, Depends(get_recommender)],
):
    product = recommender.get_product_detail(query.product_id)
    return get_product_detail_mapper(product)
