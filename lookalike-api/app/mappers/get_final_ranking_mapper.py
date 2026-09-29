from app.models.product import Product
from app.schemas.response.get_final_ranking_response import GetFinalRankingResponse


def get_final_ranking_mapper(product: Product) -> GetFinalRankingResponse:
    return GetFinalRankingResponse(
        brand_name=product.brand.name,
        category_name=product.category.name,
        product_name=product.name,
        base_price=float(product.base_price),
        image_url=product.images.url,
    )