from typing import Annotated
from fastapi import APIRouter, Depends, File, Form, UploadFile

from app.dependencies.master import get_recommender
from app.schemas.request.get_similar_products_request import GetSimilarProductsRequestSchema
from app.services.recommender_service import Recommender

router = APIRouter(tags=["Products"])


@router.post("/similar-products")
def get_similar_products_view(
    image_file: Annotated[UploadFile, File()],
    form: Annotated[GetSimilarProductsRequestSchema, Form()],
    recommender: Annotated[Recommender, Depends(get_recommender)],
):
    return recommender.find_similar_products(
        image=image_file,
        min_price=form.min_price,
        max_price=form.max_price,
        materials=form.materials,
        priority=form.priority,
    )