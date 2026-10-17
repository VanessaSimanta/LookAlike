from sqlalchemy.orm.attributes import set_committed_value

from app.models.product import Product
from app.repositories.protocols import (
    BrandRepositoryProtocol,
    CategoryRepositoryProtocol,
    ProductImageRepositoryProtocol,
    ProductRepositoryProtocol,
)


class GetFinalRankingUseCase:
    def __init__(
        self,
        product_repository: ProductRepositoryProtocol,
        brand_repository: BrandRepositoryProtocol,
        category_repository: CategoryRepositoryProtocol,
        product_image_repository: ProductImageRepositoryProtocol,
    ) -> None:
        self._product_repository = product_repository
        self._brand_repository = brand_repository
        self._category_repository = category_repository
        self._product_image_repository = product_image_repository

    def execute(self, product_ids: list[int]) -> list[Product]:
        products = self._product_repository.get_by_ids(product_ids)

        self._load_brands(products)
        self._load_categories(products)
        self._load_images(products)

        return products

    def _load_brands(self, products: list[Product]) -> None:
        brand_ids = list({product.brand_id for product in products})
        brands = self._brand_repository.get_by_ids(brand_ids)
        brand_map = {brand.id: brand for brand in brands}

        for product in products:
            set_committed_value(product, "brand", brand_map.get(product.brand_id))

    def _load_categories(self, products: list[Product]) -> None:
        category_ids = list({product.category_id for product in products})
        categories = self._category_repository.get_by_ids(category_ids)
        category_map = {category.id: category for category in categories}

        for product in products:
            set_committed_value(
                product, "category", category_map.get(product.category_id)
            )

    def _load_images(self, products: list[Product]) -> None:
        product_ids = [product.id for product in products]
        images = self._product_image_repository.get_by_product_ids(product_ids)
        image_map = {image.product_id: image for image in images}

        for product in products:
            set_committed_value(product, "images", image_map.get(product.id))
