import uuid

from sqlalchemy.orm import Session

from .models.balance import Balance
from .models.user import User
from .schemas.balance import BalanceCreate, BalanceUpdate
from .schemas.user import UserCreate


def get_user_by_id(db: Session, user_id: uuid.UUID) -> User | None:
    return db.query(User).filter(User.id == user_id).first()


def get_balances_by_user(db: Session, user_id: uuid.UUID) -> list[Balance]:
    return db.query(Balance).filter(Balance.owner_id == user_id).all()


def delete_balance(db: Session, balance_id: uuid.UUID) -> bool:
    db_balance = db.query(Balance).filter(Balance.id == balance_id).first()
    if db_balance is None:
        return False
    db.delete(db_balance)
    db.commit()
    return True


def update_balance(db: Session, balance_id: uuid.UUID, balance: BalanceUpdate) -> Balance | None:
    db_balance = db.query(Balance).filter(Balance.id == balance_id).first()
    if db_balance is None:
        return None
    for field, value in balance.model_dump(exclude_unset=True).items():
        setattr(db_balance, field, value)
    db.commit()
    db.refresh(db_balance)
    return db_balance


def create_balance(db: Session, user_id: uuid.UUID, balance: BalanceCreate) -> Balance:
    db_balance = Balance(owner_id=user_id, **balance.model_dump())
    db.add(db_balance)
    db.commit()
    db.refresh(db_balance)
    return db_balance


def create_user(db: Session, user: UserCreate) -> User:
    db_user = User(username=user.username)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
