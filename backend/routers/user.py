from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database import get_db
import models

router = APIRouter(prefix="/user", tags=["User & Wallet"])


class UserResponse(BaseModel):
    id: int
    wallet_address: str
    portfolio_balance: float

    class Config:
        from_attributes = True


class DepositRequest(BaseModel):
    amount: float = Field(..., gt=0)


class DepositResponse(BaseModel):
    status: str
    wallet_address: str
    new_balance: float


@router.get("/{wallet_address}", response_model=UserResponse)
async def get_or_create_user(wallet_address: str, db: Session = Depends(get_db)):
    """
    Look up a user by wallet address.
    If the user doesn't exist, create them with a default balance of ₹1,00,000.
    """
    user = db.query(models.User).filter(
        models.User.wallet_address == wallet_address
    ).first()

    if not user:
        user = models.User(
            wallet_address=wallet_address,
            portfolio_balance=100000.0,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return user


@router.post("/{wallet_address}/deposit", response_model=DepositResponse)
async def deposit(
    wallet_address: str,
    req: DepositRequest,
    db: Session = Depends(get_db),
):
    """
    Add funds to a user's portfolio balance.
    """
    user = db.query(models.User).filter(
        models.User.wallet_address == wallet_address
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.portfolio_balance += req.amount
    db.commit()
    db.refresh(user)

    return DepositResponse(
        status="Deposit successful",
        wallet_address=user.wallet_address,
        new_balance=user.portfolio_balance,
    )
