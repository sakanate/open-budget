import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class BalanceCreate(BaseModel):
    category: str
    description: str
    amount: int
    story: str


class BalanceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    owner_id: uuid.UUID
    category: str
    description: str
    amount: int
    story: str
    created_at: datetime
