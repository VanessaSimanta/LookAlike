from sqlalchemy.orm.attributes import set_committed_value

from app.models.product import Product
from app.repositories.protocols import (
    CategoryRepositoryProtocol,
    ProductImageRepositoryProtocol,
    ProductRepositoryProtocol,
)

EXCLUDED_RANDOM_CATEGORIES = ["Underwear", "Lingerie", "Swimwear", "Other"]


class GetRandomSampleUseCase:
    def __init__(
        self,
        product_repository: ProductRepositoryProtocol,
        category_repository: CategoryRepositoryProtocol,
        product_image_repository: ProductImageRepositoryProtocol,
    ) -> None:
        self._product_repository = product_repository
        self._category_repository = category_repository
        self._product_image_repository = product_image_repository

    def execute(self, limit: int) -> list[Product]:
        excluded_category_ids = self._category_repository.get_ids_by_names(
            EXCLUDED_RANDOM_CATEGORIES
        )
        products = self._product_repository.get_random(limit, excluded_category_ids)

        self._load_images(products)

        return products

    def _load_images(self, products: list[Product]) -> None:
        product_ids = [product.id for product in products]
        images = self._product_image_repository.get_by_product_ids(product_ids)
        image_map = {image.product_id: image for image in images}

        for product in products:
            set_committed_value(product, "images", image_map.get(product.id))
