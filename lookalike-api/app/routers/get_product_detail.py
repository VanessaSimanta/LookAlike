from typing import Annotated
from fastapi import APIRouter, Depends, Query

from app.dependencies.master import get_product_detail_use_case
from app.mappers.get_product_detail_mapper import get_product_detail_mapper
from app.schemas.request.get_product_detail_request import GetProductDetailRequestSchema
from app.schemas.response.get_product_detail_response import GetProductDetailResponse
from app.schemas.response.standard_response import StandardResponse
from app.usecase.get_product_detail_usecase import GetProductDetailUseCase
from app.utils.standard_response import StandardResponseBuilder

router = APIRouter(tags=["Products"])


@router.get(
    "/product-detail",
    response_model=StandardResponse[GetProductDetailResponse],
)
def get_product_detail(
    query: Annotated[GetProductDetailRequestSchema, Query()],
    use_case: Annotated[GetProductDetailUseCase, Depends(get_product_detail_use_case)],
):
    product = use_case.execute(query.product_id)
    return (
        StandardResponseBuilder()
        .set_data(get_product_detail_mapper(product))
        .build()
    )
