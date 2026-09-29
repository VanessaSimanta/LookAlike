from pydantic import BaseModel, Field


class GetProductDetailRequestSchema(BaseModel):
    product_id: int = Field(...)