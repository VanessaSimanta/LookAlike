from sqlalchemy import Column, Integer, String, Numeric, Text, ForeignKey
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship

from app.dependencies.database import Base


class Product(Base):
    __tablename__ = "product"

    id = Column(Integer, primary_key=True, autoincrement=True)
    brand_id = Column(Integer, ForeignKey("brand.id"), nullable=False, index=True)
    category_id = Column(Integer, ForeignKey("category.id"), nullable=False, index=True)
    product_code = Column(String(50), nullable=False, unique=True)
    name = Column(String(150), nullable=False)
    base_price = Column(Numeric(12, 2), nullable=False)
    promo_price = Column(Numeric(12, 2), nullable=True)
    discount_percent = Column(Numeric(5, 2), nullable=True)
    rating = Column(Numeric(3, 2), nullable=True)
    colors = Column(ARRAY(Text), nullable=True)
    sizes = Column(ARRAY(Text), nullable=True)
    material = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)

    brand = relationship("Brand", back_populates="products")
    category = relationship("Category", back_populates="products")
    images = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan", uselist=False)