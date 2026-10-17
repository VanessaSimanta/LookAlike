from fastapi import FastAPI
from app.routers.get_final_ranking import router as get_final_ranking_router
from app.routers.get_product_detail import router as get_product_detail_router
from app.routers.get_similar_products import router as get_similar_products_router
from app.routers.get_random_sample import router as get_random_sample_router
from contextlib import asynccontextmanager
from app.dependencies.master import get_feature_extractor, get_feature_index
from app.middlewares.error_middleware import register_error_handlers
from app.middlewares.cors_middleware import register_cors


@asynccontextmanager
async def lifespan(app: FastAPI):
    get_feature_extractor()
    get_feature_index()
    yield

app = FastAPI(title="LookAlike API", lifespan=lifespan)

register_cors(app)
register_error_handlers(app)

app.include_router(get_final_ranking_router)
app.include_router(get_product_detail_router)
app.include_router(get_similar_products_router)
app.include_router(get_random_sample_router)