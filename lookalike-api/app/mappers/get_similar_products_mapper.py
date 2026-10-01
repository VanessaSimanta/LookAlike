from app.models.product import Product
from app.schemas.response.get_similar_products_response import SimilarProductResponse


def get_similar_products_mapper(product: Product, similarity_score: float) -> SimilarProductResponse:
    return SimilarProductResponse(
        product_id=product.id,
        name=product.name,
        brand_name=product.brand.name if product.brand else None,
        category_name=product.category.name if product.category else None,
        base_price=product.base_price,
        image_url=product.images.url if product.images else None,
        similarity_score=similarity_score * 100,
    )