from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
import models

router = APIRouter(prefix="/academy", tags=["Academy"])


# ── Pydantic Models ─────────────────────────────────────

class Course(BaseModel):
    id: int
    title: str
    description: str
    reward: float
    category: str


class CompleteRequest(BaseModel):
    wallet_address: str


class CompleteResponse(BaseModel):
    status: str
    course_title: str
    reward: float
    new_balance: float


# ── Mock Course Catalogue ────────────────────────────────

COURSES: list[Course] = [
    Course(
        id=1,
        title="Web3 Fundamentals: Wallets & Transactions",
        description="Master the foundations of blockchain wallets, gas fees, and on-chain transactions. Covers MetaMask integration, signing messages, and reading the Ethereum mempool.",
        reward=500.0,
        category="Web3",
    ),
    Course(
        id=2,
        title="Kautilya's Guide to Value Investing",
        description="Learn time-tested value investing principles through the lens of Arthashastra philosophy. Analyse P/E ratios, DCF models, and moat identification.",
        reward=750.0,
        category="Investing",
    ),
    Course(
        id=3,
        title="FinBERT & Sentiment Analysis",
        description="Understand how transformer-based NLP models like FinBERT quantify market sentiment from news headlines, SEC filings, and social media.",
        reward=600.0,
        category="AI / ML",
    ),
    Course(
        id=4,
        title="DeFi Yield Strategies",
        description="Explore decentralized finance protocols — liquidity pools, yield farming, impermanent loss, and risk-adjusted APY calculations.",
        reward=850.0,
        category="Web3",
    ),
]

_COURSE_MAP: dict[int, Course] = {c.id: c for c in COURSES}


# ── Endpoints ────────────────────────────────────────────

@router.get("/courses", response_model=list[Course])
async def list_courses():
    """Return the full catalogue of available academy courses."""
    return COURSES


@router.post("/complete/{course_id}", response_model=CompleteResponse)
async def complete_course(
    course_id: int,
    req: CompleteRequest,
    db: Session = Depends(get_db),
):
    """
    Mark a course as completed.
    Adds the course reward to the user's portfolio balance in PostgreSQL.
    """
    course = _COURSE_MAP.get(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    user = db.query(models.User).filter(
        models.User.wallet_address == req.wallet_address
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.portfolio_balance += course.reward
    db.commit()
    db.refresh(user)

    return CompleteResponse(
        status="Course completed — reward credited",
        course_title=course.title,
        reward=course.reward,
        new_balance=user.portfolio_balance,
    )
