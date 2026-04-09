import uuid

from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from . import crud
from .database import get_db
from .schemas.balance import BalanceCreate, BalanceResponse, BalanceUpdate
from .schemas.user import UserCreate, UserResponse

app = FastAPI()

api_v1 = FastAPI()


@api_v1.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: uuid.UUID, db: Session = Depends(get_db)):
    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


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


@api_v1.patch("/users/{user_id}/balances/{balance_id}", response_model=BalanceResponse)
def update_balance(
    user_id: uuid.UUID, balance_id: uuid.UUID, balance: BalanceUpdate, db: Session = Depends(get_db)
):
    updated = crud.update_balance(db, balance_id, balance)
    if not updated:
        raise HTTPException(status_code=404, detail="Balance not found")
    return updated


@api_v1.delete("/users/{user_id}/balances/{balance_id}", status_code=204)
def delete_balance(user_id: uuid.UUID, balance_id: uuid.UUID, db: Session = Depends(get_db)):
    if not crud.delete_balance(db, balance_id):
        raise HTTPException(status_code=404, detail="Balance not found")


app.mount("/v1", api_v1)
