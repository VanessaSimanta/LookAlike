import numpy as np


class FeatureIndex:
    def __init__(self, product_ids: np.ndarray, feature_vectors: np.ndarray):
        self.product_ids = product_ids          
        self.feature_vectors = feature_vectors  

    @classmethod
    def from_rows(cls, rows) -> "FeatureIndex":
        product_ids = np.array([row.product_id for row in rows])
        feature_vectors = np.vstack(
            [np.asarray(row.feature_vector, dtype=np.float32) for row in rows]
        )
        return cls(product_ids, feature_vectors)