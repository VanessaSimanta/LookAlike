from typing import Any, Optional

from fastapi import status


class StandardResponseBuilder:
    def __init__(self):
        self._status_code: int = status.HTTP_200_OK
        self._error: Optional[str] = None
        self._error_detail: Any = None
        self._data: Any = None

    def set_status_code(
        self, status_code: int = status.HTTP_200_OK
    ) -> "StandardResponseBuilder":
        self._status_code = status_code
        return self

    def set_error(
        self,
        message: str | Exception,
        detail: Any = None,
    ) -> "StandardResponseBuilder":
        self._error = str(message)
        self._error_detail = detail
        return self

    def from_validation_errors(
        self,
        errors: list[dict],
    ) -> "StandardResponseBuilder":
        self._error = "Validation Error"
        self._error_detail = format_validation_errors(errors)
        return self

    def set_data(self, data: Any) -> "StandardResponseBuilder":
        self._data = data
        return self

    def _build_error(self) -> dict:
        return {
            "status": bool(self._error),
            "code": self._status_code,
            "message": self._error if self._error else "",
            "detail": self._error_detail,
        }

    def build(self) -> dict:
        return {
            "error": self._build_error(),
            "data": self._data,
        }

REQUEST_LOCATIONS = {"query", "body", "path", "header", "cookie"}

def format_validation_errors(errors: list[dict]) -> dict[str, list[str]]:
    formatted: dict[str, list[str]] = {}

    for error in errors:
        loc = list(error.get("loc", ()))
        if loc and loc[0] in REQUEST_LOCATIONS:
            loc = loc[1:]

        field = ".".join(str(item) for item in loc) if loc else "non_field_error"

        message = error.get("msg", "")

        ge = (error.get("ctx") or {}).get("ge")
        if "greater than or equal to" in message and ge is not None:
            message = f"Ensure this value is greater than or equal to {ge}."

        message = message.removeprefix("Value error, ")

        formatted.setdefault(field, []).append(message)

    return formatted
