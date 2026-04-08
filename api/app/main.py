import uuid

from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from . import crud
from .database import get_db
from .schemas.balance import BalanceCreate, BalanceResponse
from .schemas.user import UserCreate, UserResponse

app = FastAPI()

api_v1 = FastAPI()


@api_v1.post("/users", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
        return crud.create_user(db, user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Username already exists")


@api_v1.get("/users/{user_id}/balances", response_model=list[BalanceResponse])
def get_balances(user_id: uuid.UUID, db: Session = Depends(get_db)):
    return crud.get_balances_by_user(db, user_id)


@api_v1.post("/users/{user_id}/balances", response_model=BalanceResponse)
def create_balance(
    user_id: uuid.UUID, balance: BalanceCreate, db: Session = Depends(get_db)
):
    return crud.create_balance(db, user_id, balance)


@api_v1.delete("/users/{user_id}/balances/{balance_id}", status_code=204)
def delete_balance(user_id: uuid.UUID, balance_id: uuid.UUID, db: Session = Depends(get_db)):
    if not crud.delete_balance(db, balance_id):
        raise HTTPException(status_code=404, detail="Balance not found")


app.mount("/v1", api_v1)
