import io
from pathlib import Path

import numpy as np
import tensorflow as tf

from app.errors.invalid_image_error import InvalidImageError
from PIL import UnidentifiedImageError


load_img = tf.keras.utils.load_img
img_to_array = tf.keras.utils.img_to_array
preprocess_input = tf.keras.applications.efficientnet.preprocess_input


MODEL_PATH = Path(__file__).parent / "feature_extractor.keras"
IMG_SIZE = (224, 224)
FEATURE_DIM = 1280


class FeatureExtractor:
    def __init__(self, model_path: Path = MODEL_PATH):
        self.model = tf.keras.models.load_model(model_path, compile=False)

    def extract(self, image_bytes: bytes) -> np.ndarray:
        try:
            img = load_img(io.BytesIO(image_bytes), target_size=IMG_SIZE)
        except (UnidentifiedImageError, OSError) as exc:
            raise InvalidImageError() from exc

        img_array = img_to_array(img)
        img_array = preprocess_input(img_array)
        img_array = np.expand_dims(img_array, axis=0)           
        query_vector = self.model.predict(img_array, verbose=0) 

        if query_vector.shape != (1, FEATURE_DIM):
            raise ValueError(f"Shape fitur {query_vector.shape}, seharusnya (1, {FEATURE_DIM})")
        return query_vector