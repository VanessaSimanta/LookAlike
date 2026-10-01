from typing import Annotated, Optional

from fastapi import Form
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel, Field, ValidationError, model_validator

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

    @classmethod
    def as_form(
        cls,
        min_price: Annotated[Optional[float], Form()] = None,
        max_price: Annotated[Optional[float], Form()] = None,
        materials: Annotated[Optional[list[str]], Form()] = None,
        priority: Annotated[Optional[Priority], Form()] = None,
    ) -> "GetSimilarProductsRequestSchema":
        try:
            return cls(
                min_price=min_price,
                max_price=max_price,
                materials=materials,
                priority=priority,
            )
        except ValidationError as exc:
            raise RequestValidationError(
                exc.errors(include_url=False, include_context=False)
            ) from exc