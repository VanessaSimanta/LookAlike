from fastapi import FastAPI
from app.views.get_final_ranking_view import router as get_final_ranking_router
from app.views.get_product_detail_view import router as get_product_detail_router
from app.views.get_similar_products_view import router as get_similar_products_router

app = FastAPI(title="LookAlike API")

app.include_router(get_final_ranking_router)
app.include_router(get_product_detail_router)
app.include_router(get_similar_products_router)