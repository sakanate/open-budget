import uuid

from pydantic import BaseModel, ConfigDict


class UserCreate(BaseModel):
    username: str


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    username: str
