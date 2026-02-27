from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database import get_db
import models

router = APIRouter(prefix="/user", tags=["User & Wallet"])



from typing import List, Optional
from datetime import datetime

class TransactionModel(BaseModel):
    amount: float
    type: str
    description: Optional[str] = None
    date: datetime

    class Config:
        from_attributes = True

class PortfolioInsights(BaseModel):
    win_rate: float
    reputation_score: int
    net_worth: float
    asset_allocation: dict[str, float] # e.g. {'Cash': 70, 'Locked': 30}
    
class UserAnalytics(BaseModel):
    id: int
    wallet_address: str
    portfolio_balance: float
    total_xp: int
    courses_completed: int
    predictions_made: int
    portfolio_history: List[TransactionModel]
    insights: PortfolioInsights

    class Config:
        from_attributes = True

class DepositRequest(BaseModel):
    amount: float = Field(..., gt=0)

class DepositResponse(BaseModel):
    status: str
    wallet_address: str
    new_balance: float

@router.get("/{wallet_address}", response_model=UserAnalytics)
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

    # --- Analytics Logic ---
    
    # 1. Learning Progress
    total_xp = sum(p.xp_earned for p in user.progress) if user.progress else 0
    courses_completed = len(user.progress) if user.progress else 0

    # 2. Prediction History
    predictions_made = len(user.predictions) if user.predictions else 0

    # 3. Portfolio Insights (Recent Transactions)
    recent_txs = sorted(user.transactions, key=lambda t: t.timestamp, reverse=True)[:10] if user.transactions else []
    
    # 4. Detailed Insights logic
    # Mock calculation for Win Rate and Asset Allocation
    win_rate = 0.0
    if predictions_made > 0:
        # Assuming predictions have a 'result' field or similar logic. 
        # For now, we simulate a win rate based on XP or random for demo
        # logical: if user earned XP, they likely made good predictions (if XP is tied to success)
        win_rate = min(100.0, (total_xp / (predictions_made * 10 + 1)) * 100)
    
    # Mock Asset Allocation
    # In a full system, we'd query active bets/investments
    cash_percentage = 100.0
    locked_percentage = 0.0
    
    reputation_score = int(total_xp / 10) + (predictions_made * 5)

    insights_data = PortfolioInsights(
        win_rate=round(win_rate, 2),
        reputation_score=reputation_score,
        net_worth=user.portfolio_balance, # + locked assets
        asset_allocation={"Cash": cash_percentage, "Locked": locked_percentage}
    )

    history_data = [
        TransactionModel(
            amount=t.amount,
            type=t.type,
            description=t.description,
            date=t.timestamp
        ) for t in recent_txs
    ]

    return UserAnalytics(
        id=user.id,
        wallet_address=user.wallet_address,
        portfolio_balance=user.portfolio_balance,
        total_xp=total_xp,
        courses_completed=courses_completed,
        predictions_made=predictions_made,
        portfolio_history=history_data,
        insights=insights_data
    )

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
    
    # Create transaction record
    new_tx = models.Transaction(
        user_id=user.id,
        amount=req.amount,
        type="credit",
        description="Wallet Deposit",
        timestamp=datetime.utcnow()
    )
    db.add(new_tx)

    db.commit()
    db.refresh(user)

    return DepositResponse(
        status="Deposit successful",
        wallet_address=user.wallet_address,
        new_balance=user.portfolio_balance,
    )

