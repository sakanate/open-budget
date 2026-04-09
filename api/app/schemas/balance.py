import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class BalanceCreate(BaseModel):
    category: str
    description: str
    amount: int
    story: Optional[str] = None


class BalanceUpdate(BaseModel):
    category: Optional[str] = None
    description: Optional[str] = None
    amount: Optional[int] = None
    story: Optional[str] = None


class BalanceResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    owner_id: uuid.UUID
    category: str
    description: str
    amount: int
    story: Optional[str] = None
    created_at: datetime
