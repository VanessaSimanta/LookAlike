from sqlalchemy.exc import NoResultFound
from sqlalchemy.orm.attributes import set_committed_value

from app.errors.product_not_found import ProductNotFoundError
from app.models.product import Product
from app.repositories.protocols import (
    BrandRepositoryProtocol,
    CategoryRepositoryProtocol,
    ProductImageRepositoryProtocol,
    ProductRepositoryProtocol,
)


class GetProductDetailUseCase:
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

    def execute(self, product_id: int) -> Product:
        product = self._get_product(product_id)

        self._load_brand(product)
        self._load_category(product)
        self._load_image(product)

        return product

    def _get_product(self, product_id: int) -> Product:
        try:
            return self._product_repository.get_by_id(product_id)
        except NoResultFound:
            raise ProductNotFoundError([product_id])

    def _load_brand(self, product: Product) -> None:
        brands = self._brand_repository.get_by_ids([product.brand_id])

        set_committed_value(product, "brand", brands[0] if brands else None)

    def _load_category(self, product: Product) -> None:
        categories = self._category_repository.get_by_ids([product.category_id])

        set_committed_value(product, "category", categories[0] if categories else None)

    def _load_image(self, product: Product) -> None:
        images = self._product_image_repository.get_by_product_ids([product.id])

        set_committed_value(product, "images", images[0] if images else None)
