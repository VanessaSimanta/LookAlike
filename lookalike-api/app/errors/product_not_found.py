class ProductNotFoundError(Exception):
    def __init__(self, missing_ids: list[int]):
        self.missing_ids = missing_ids
        super().__init__(f"Produk tidak ditemukan: {missing_ids}")