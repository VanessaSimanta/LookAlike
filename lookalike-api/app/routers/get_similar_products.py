from typing import Annotated
from fastapi import APIRouter, Depends, File, UploadFile

from app.dependencies.master import get_similar_products_use_case
from app.schemas.request.get_similar_products_request import (
    GetSimilarProductsRequestSchema,
)
from app.schemas.response.get_similar_products_response import (
    SimilarProductResponse,
)
from app.schemas.response.standard_response import StandardResponse
from app.usecase.get_similar_products_usecase import GetSimilarProductsUseCase
from app.mappers.get_similar_products_mapper import get_similar_products_mapper
from app.utils.standard_response import StandardResponseBuilder


router = APIRouter(tags=["Products"])


@router.post(
    "/similar-products",
    response_model=StandardResponse[list[SimilarProductResponse]],
)
def get_similar_products(
    image_file: Annotated[UploadFile, File()],
    form: Annotated[
        GetSimilarProductsRequestSchema,
        Depends(GetSimilarProductsRequestSchema.as_form),
    ],
    use_case: Annotated[
        GetSimilarProductsUseCase, Depends(get_similar_products_use_case)
    ],
):
    result = use_case.execute(
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