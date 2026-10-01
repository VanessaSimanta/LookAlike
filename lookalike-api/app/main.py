from fastapi import FastAPI
from app.views.get_final_ranking_view import router as get_final_ranking_router
from app.views.get_product_detail_view import router as get_product_detail_router
from app.views.get_similar_products_view import router as get_similar_products_router
from contextlib import asynccontextmanager
from app.dependencies.master import get_feature_extractor, get_feature_index


@asynccontextmanager
async def lifespan(app: FastAPI):
    get_feature_extractor()
    get_feature_index()
    yield

app = FastAPI(title="LookAlike API", lifespan=lifespan)

app.include_router(get_final_ranking_router)
app.include_router(get_product_detail_router)
app.include_router(get_similar_products_router)