from pydantic import BaseModel, Field


class GetFinalRankingRequestSchema(BaseModel):
    product_ids: list[int] = Field(...)