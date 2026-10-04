from fastapi import status

from app.errors.base_error import BaseAppError


class InvalidImageError(BaseAppError):
    status_code = status.HTTP_400_BAD_REQUEST

    def __init__(self, message: str = "File yang diupload bukan gambar yang valid"):
        super().__init__(message=message)
