from pydantic import BaseModel


class GetRandomSampleResponse(BaseModel):
    image_url: str
