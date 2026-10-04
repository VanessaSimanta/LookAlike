from typing import Any, Generic, Optional, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class ErrorResponse(BaseModel):
    status: bool
    code: int
    message: str
    detail: Any = None


class StandardResponse(BaseModel, Generic[T]):
    error: ErrorResponse
    data: Optional[T] = None
