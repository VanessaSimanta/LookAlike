from typing import Annotated
from fastapi import APIRouter, Depends, Query, Response

from app.dependencies.master import get_sample_image_use_case
from app.schemas.request.get_sample_image_request import GetSampleImageRequestSchema
from app.usecase.get_sample_image_usecase import GetSampleImageUseCase

router = APIRouter(tags=["Products"])


@router.get("/sample-image", response_class=Response)
def get_sample_image(
    query: Annotated[GetSampleImageRequestSchema, Query()],
    use_case: Annotated[GetSampleImageUseCase, Depends(get_sample_image_use_case)],
):
    content, content_type = use_case.execute(query.url)
    return Response(
        content=content,
        media_type=content_type,
        headers={"Cache-Control": "public, max-age=86400"},
    )
