from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.dependencies.master import get_recommender
from app.errors.product_not_found import ProductNotFoundError
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
    
    try:
        product = recommender.get_product_detail(query.product_id)
    except ProductNotFoundError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    return get_product_detail_mapper(product)