from typing import Optional
from pydantic import BaseModel, Field, model_validator

from app.enums.priority_enum import Priority


class GetSimilarProductsRequestSchema(BaseModel):
    min_price: Optional[float] = Field(default=None, ge=0)
    max_price: Optional[float] = Field(default=None, ge=0)
    materials: Optional[list[str]] = None
    priority: Optional[Priority] = None

    @model_validator(mode="after")
    def validate_price_range(self):
        if (
            self.min_price is not None
            and self.max_price is not None
            and self.min_price > self.max_price
        ):
            raise ValueError("min_price tidak boleh lebih besar dari max_price")
        return self