from sqlalchemy import Column, Integer, String, Float

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    wallet_address = Column(String, unique=True, index=True, nullable=False)
    portfolio_balance = Column(Float, default=100000.0)
