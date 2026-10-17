from typing import Protocol

from app.models.brand import Brand
from app.models.category import Category
from app.models.product import Product
from app.models.product_image import ProductImage


class BrandRepositoryProtocol(Protocol):
    def get_by_ids(self, ids: list[int]) -> list[Brand]: ...


class CategoryRepositoryProtocol(Protocol):
    def get_by_ids(self, ids: list[int]) -> list[Category]: ...

    def get_ids_by_names(self, names: list[str]) -> list[int]: ...


class ProductRepositoryProtocol(Protocol):
    def get_by_ids(self, ids: list[int]) -> list[Product]: ...

    def get_by_id(self, id: int) -> Product: ...

    def get_random(
        self, limit: int, excluded_category_ids: list[int]
    ) -> list[Product]: ...


class ProductImageRepositoryProtocol(Protocol):
    def get_by_product_ids(self, product_ids: list[int]) -> list[ProductImage]: ...

    def get_all_feature_vectors(self) -> list[ProductImage]: ...
