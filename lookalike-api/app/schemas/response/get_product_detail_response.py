from typing import Optional

from pydantic import BaseModel


class GetProductDetailResponse(BaseModel):
    brand_name: str
    product_name: str
    base_price: float
    promo_price: Optional[float] = None
    rating: Optional[float] = None
    category_name: str
    material: str
    sizes: Optional[list[str]] = None
    colors: Optional[list[str]] = None
    image_url: str
