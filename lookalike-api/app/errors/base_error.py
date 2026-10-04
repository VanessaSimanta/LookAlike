from typing import Any

from fastapi import status


class BaseAppError(Exception):
    status_code: int = status.HTTP_400_BAD_REQUEST

    def __init__(self, message: str, detail: Any = None):
        self.message = message
        self.detail = detail
        super().__init__(message)
