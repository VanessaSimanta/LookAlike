from app.models.product import Product
from app.schemas.response.get_random_sample_response import GetRandomSampleResponse


def get_random_sample_mapper(product: Product) -> GetRandomSampleResponse:
    return GetRandomSampleResponse(
        image_url=product.images.url,
    )
