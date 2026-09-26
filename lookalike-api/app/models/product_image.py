from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector

from app.database import Base


class ProductImage(Base):
    __tablename__ = "product_image"

    id = Column(Integer, primary_key=True, autoincrement=True)
    product_id = Column(Integer, ForeignKey("product.id", ondelete="CASCADE"), nullable=False, index=True)

    local_path = Column(String(200), nullable=False)
    url = Column(String(200), nullable=False)
    feature_vector = Column(Vector(1280), nullable=False)

    product = relationship("Product", back_populates="images")