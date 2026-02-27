from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    wallet_address = Column(String, unique=True, index=True, nullable=False)
    portfolio_balance = Column(Float, default=100000.0)


class ModuleCompletion(Base):
    """Tracks each module a user has passed."""
    __tablename__ = "module_completions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, nullable=False)
    module_id = Column(Integer, nullable=False)
    score = Column(Integer, nullable=False)
    total = Column(Integer, nullable=False)
    completed_at = Column(DateTime, server_default=func.now())

    __table_args__ = (
        UniqueConstraint("user_id", "course_id", "module_id", name="uq_user_course_module"),
    )


class CourseCompletion(Base):
    """Tracks completed courses and the reward credited."""
    __tablename__ = "course_completions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, nullable=False)
    reward_credited = Column(Float, default=0.0)
    completed_at = Column(DateTime, server_default=func.now())

    __table_args__ = (
        UniqueConstraint("user_id", "course_id", name="uq_user_course"),
    )
