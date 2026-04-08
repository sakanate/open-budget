from sqlalchemy.orm import Session

from .models.user import User
from .schemas.user import UserCreate


def create_user(db: Session, user: UserCreate) -> User:
    db_user = User(username=user.username)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
