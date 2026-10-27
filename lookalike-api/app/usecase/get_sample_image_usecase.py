import httpx

from app.errors.sample_image_fetch_error import SampleImageFetchError
from app.errors.sample_image_not_found import SampleImageNotFoundError
from app.repositories.protocols import ProductImageRepositoryProtocol

FETCH_TIMEOUT_SECONDS = 10.0
FETCH_HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; LookAlike/1.0)"}


class GetSampleImageUseCase:
    def __init__(
        self,
        product_image_repository: ProductImageRepositoryProtocol,
    ) -> None:
        self._product_image_repository = product_image_repository

    def execute(self, url: str) -> tuple[bytes, str]:
        if not self._product_image_repository.exists_by_url(url):
            raise SampleImageNotFoundError(url)

        try:
            response = httpx.get(
                url,
                headers=FETCH_HEADERS,
                timeout=FETCH_TIMEOUT_SECONDS,
                follow_redirects=True,
            )
            response.raise_for_status()
        except httpx.HTTPError as e:
            print("Error in get_sample_image usecase:", e)
            raise SampleImageFetchError(url)

        content_type = response.headers.get("content-type", "").split(";")[0].strip()
        if not content_type.startswith("image/"):
            raise SampleImageFetchError(url)

        return response.content, content_type
