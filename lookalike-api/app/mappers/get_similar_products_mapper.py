from typing import Optional

from app.models.product import Product
from app.schemas.response.get_similar_products_response import SimilarProductResponse


def get_similar_products_mapper(product: Product, similarity_score: float, saw_score: Optional[float] = None) -> SimilarProductResponse:
    return SimilarProductResponse(
        product_id=product.id,
        name=product.name,
        brand_name=product.brand.name if product.brand else None,
        category_name=product.category.name if product.category else None,
        base_price=product.base_price,
        promo_price=product.promo_price if product.promo_price is not None else None,
        image_url=product.images.url if product.images else None,
        material=product.material,
        similarity_score=similarity_score * 100,
        saw_score=saw_score,
    )