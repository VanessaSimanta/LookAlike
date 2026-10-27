from fastapi import status

from app.errors.base_error import BaseAppError


class SampleImageNotFoundError(BaseAppError):
    status_code = status.HTTP_404_NOT_FOUND

    def __init__(self, url: str):
        super().__init__(
            message="Gambar sample tidak ditemukan",
            detail={"url": url},
        )
