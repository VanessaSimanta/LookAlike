from typing import Optional

from pydantic import BaseModel


class SimilarProductResponse(BaseModel):
    product_id: int
    name: str
    brand_name: Optional[str] = None
    category_name: Optional[str] = None
    base_price: int
    image_url: Optional[str] = None
    similarity_score: float