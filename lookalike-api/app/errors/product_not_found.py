from fastapi import status

from app.errors.base_error import BaseAppError


class ProductNotFoundError(BaseAppError):
    status_code = status.HTTP_404_NOT_FOUND

    def __init__(self, missing_ids: list[int]):
        self.missing_ids = missing_ids
        super().__init__(
            message=f"Produk tidak ditemukan: {missing_ids}",
            detail={"missing_ids": missing_ids},
        )
