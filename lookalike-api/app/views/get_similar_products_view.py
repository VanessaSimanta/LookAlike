from typing import Annotated
from fastapi import APIRouter, Depends, File, UploadFile

from app.dependencies.master import get_recommender
from app.schemas.request.get_similar_products_request import (
    GetSimilarProductsRequestSchema,
)
from app.schemas.response.get_similar_products_response import (
    SimilarProductResponse,
)
from app.schemas.response.standard_response import StandardResponse
from app.services.recommender_service import Recommender
from app.mappers.get_similar_products_mapper import get_similar_products_mapper
from app.utils.standard_response import StandardResponseBuilder


router = APIRouter(tags=["Products"])


@router.post(
    "/similar-products",
    response_model=StandardResponse[list[SimilarProductResponse]],
)
def get_similar_products_view(
    image_file: Annotated[UploadFile, File()],
    form: Annotated[
        GetSimilarProductsRequestSchema,
        Depends(GetSimilarProductsRequestSchema.as_form),
    ],
    recommender: Annotated[Recommender, Depends(get_recommender)],
):
    result = recommender.find_similar_products(
        image=image_file,
        min_price=form.min_price,
        max_price=form.max_price,
        materials=form.materials,
        priority=form.priority,
    )

    return (
        StandardResponseBuilder()
        .set_data(
            [
                get_similar_products_mapper(
                    row["product"], row["similarity"], row["saw_score"]
                )
                for row in result
            ]
        )
        .build()
    )