import logging
import os

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import ValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.errors.base_error import BaseAppError
from app.utils.standard_response import StandardResponseBuilder

logger = logging.getLogger(__name__)


def _is_debug() -> bool:
    return os.getenv("DEBUG", "false").lower() == "true"


def _error_response(status_code: int, message: str, detail=None) -> JSONResponse:
    response = (
        StandardResponseBuilder()
        .set_status_code(status_code)
        .set_error(message=message, detail=detail)
        .build()
    )
    return JSONResponse(content=response, status_code=status_code)


def _validation_error_response(errors: list[dict]) -> JSONResponse:
    response = (
        StandardResponseBuilder()
        .set_status_code(status.HTTP_400_BAD_REQUEST)
        .from_validation_errors(errors)
        .build()
    )
    return JSONResponse(content=response, status_code=status.HTTP_400_BAD_REQUEST)


async def request_validation_error_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    return _validation_error_response(exc.errors())


async def pydantic_validation_error_handler(
    request: Request, exc: ValidationError
) -> JSONResponse:
    return _validation_error_response(exc.errors())


async def app_error_handler(request: Request, exc: BaseAppError) -> JSONResponse:
    return _error_response(exc.status_code, exc.message, exc.detail)


async def http_exception_handler(
    request: Request, exc: StarletteHTTPException
) -> JSONResponse:
    return _error_response(exc.status_code, str(exc.detail))


async def value_error_handler(request: Request, exc: ValueError) -> JSONResponse:
    return _error_response(status.HTTP_400_BAD_REQUEST, str(exc))


async def permission_error_handler(
    request: Request, exc: PermissionError
) -> JSONResponse:
    return _error_response(status.HTTP_403_FORBIDDEN, str(exc))


async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled error on %s %s", request.method, request.url.path)

    return _error_response(
        status.HTTP_500_INTERNAL_SERVER_ERROR,
        "Internal Server Error",
        detail=str(exc) if _is_debug() else None,
    )


def register_error_handlers(app: FastAPI) -> None:
    app.add_exception_handler(RequestValidationError, request_validation_error_handler)
    app.add_exception_handler(ValidationError, pydantic_validation_error_handler)
    app.add_exception_handler(BaseAppError, app_error_handler)
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(ValueError, value_error_handler)
    app.add_exception_handler(PermissionError, permission_error_handler)
    app.add_exception_handler(Exception, unhandled_exception_handler)
