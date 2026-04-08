from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session

from . import crud
from .database import get_db
from .schemas.user import UserCreate, UserResponse

app = FastAPI()

api_v1 = FastAPI()


@api_v1.post("/users", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db, user)


app.mount("/v1", api_v1)
