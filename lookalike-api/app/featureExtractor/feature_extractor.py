import io
import os
from datetime import datetime
from pathlib import Path

import numpy as np
import tensorflow as tf
from PIL import Image, UnidentifiedImageError
from rembg import new_session

from app.errors.invalid_image_error import InvalidImageError


img_to_array = tf.keras.utils.img_to_array
preprocess_input = tf.keras.applications.efficientnet.preprocess_input


MODEL_PATH = Path(__file__).parent / "feature_extractor.keras"
IMG_SIZE = (224, 224)
FEATURE_DIM = 1280
CLOTH_MODEL = "u2net_cloth_seg"
MASK_THRESHOLD = 128
MIN_MASK_COVERAGE = 0.05
BG_COLOR = (255, 255, 255)


class FeatureExtractor:
    def __init__(self, model_path: Path = MODEL_PATH, remove_background: bool = True):
        self.model = tf.keras.models.load_model(model_path, compile=False)
        self.remove_background = remove_background
        if remove_background:
            self.cloth_session = new_session(CLOTH_MODEL)
        debug_dir = os.getenv("REMBG_DEBUG_DIR")
        self.debug_dir = Path(debug_dir) if debug_dir else None

    def _binary_mask(self, mask: Image.Image) -> Image.Image:
        return mask.convert("L").point(lambda v: 255 if v > MASK_THRESHOLD else 0)

    def _coverage(self, mask: Image.Image) -> float:
        return np.count_nonzero(np.asarray(mask)) / (mask.width * mask.height)

    def _remove_background(self, img: Image.Image) -> Image.Image:
        mask = self._binary_mask(self.cloth_session.predict(img, cc="attire")[0])
        if self._coverage(mask) < MIN_MASK_COVERAGE:
            return img
        bbox = mask.getbbox()
        cutout = img.crop(bbox)
        mask = mask.crop(bbox)

        side = max(cutout.size)
        canvas = Image.new("RGB", (side, side), BG_COLOR)
        offset = ((side - cutout.width) // 2, (side - cutout.height) // 2)
        canvas.paste(cutout, offset, mask=mask)
        return canvas

    def _save_debug(
        self, original: Image.Image, processed: Image.Image, model_input: Image.Image
    ) -> None:
        self.debug_dir.mkdir(parents=True, exist_ok=True)
        stamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
        original.save(self.debug_dir / f"{stamp}_original.jpg", quality=90)
        processed.save(self.debug_dir / f"{stamp}_processed.png")
        model_input.save(self.debug_dir / f"{stamp}_model_input.png")

    def extract(self, image_bytes: bytes) -> np.ndarray:
        try:
            img = Image.open(io.BytesIO(image_bytes))
            img = img.convert("RGB")
        except (UnidentifiedImageError, OSError) as exc:
            raise InvalidImageError() from exc

        original = img
        if self.remove_background:
            img = self._remove_background(img)
        processed = img
        img = img.resize(IMG_SIZE, Image.NEAREST)

        if self.debug_dir:
            self._save_debug(original, processed, img)

        img_array = img_to_array(img)
        img_array = preprocess_input(img_array)
        img_array = np.expand_dims(img_array, axis=0)
        query_vector = self.model.predict(img_array, verbose=0)

        if query_vector.shape != (1, FEATURE_DIM):
            raise ValueError(f"Shape fitur {query_vector.shape}, seharusnya (1, {FEATURE_DIM})")
        return query_vector
