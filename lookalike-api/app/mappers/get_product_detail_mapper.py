from app.models.product import Product
from app.schemas.response.get_product_detail_response import GetProductDetailResponse


def get_product_detail_mapper(product: Product) -> GetProductDetailResponse:
    return GetProductDetailResponse(
        brand_name=product.brand.name,
        product_name=product.name,
        base_price=product.base_price,
        promo_price=product.promo_price,
        rating=product.rating,
        category_name=product.category.name,
        material=product.material,
        sizes=product.sizes,
        colors=product.colors,
        image_url=product.images.url,
    )