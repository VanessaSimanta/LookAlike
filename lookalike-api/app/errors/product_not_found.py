from fastapi import status


class ProductNotFoundError():
    status_code = status.HTTP_404_NOT_FOUND

    def __init__(self, missing_ids: list[int]):
        self.missing_ids = missing_ids
        super().__init__(
            message=f"Produk tidak ditemukan: {missing_ids}",
            errors={"missing_ids": missing_ids},
        )
