from pydantic import BaseModel, Field


class GetRandomSampleRequestSchema(BaseModel):
    limit: int = Field(5, ge=1, le=50)
