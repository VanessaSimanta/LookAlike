from pydantic import BaseModel


class GetFinalRankingResponse(BaseModel):
    brand_name: str
    category_name: str
    product_name: str
    base_price: float
    image_url: str
