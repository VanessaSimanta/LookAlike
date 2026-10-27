from fastapi import status

from app.errors.base_error import BaseAppError


class SampleImageFetchError(BaseAppError):
    status_code = status.HTTP_502_BAD_GATEWAY

    def __init__(self, url: str):
        super().__init__(
            message="Gagal mengambil gambar sample",
            detail={"url": url},
        )
