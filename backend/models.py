from sqlalchemy import Column, Integer, String, ForeignKey, Enum, DateTime
from sqlalchemy.orm import relationship, declarative_base
import enum
from datetime import datetime

Base = declarative_base()

class Role(str, enum.Enum):
    ADMIN = "admin"
    COMMANDER = "commander"
    LOGISTICS = "logistics"

class TransactionType(str, enum.Enum):
    PURCHASE = "purchase"
    TRANSFER = "transfer"
    CONSUMPTION = "consumption"

class BaseLocation(Base):
    __tablename__ = "bases"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    location = Column(String)

class AssetType(Base):
    __tablename__ = "asset_types"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    category = Column(String)
    description = Column(String, nullable=True)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(Enum(Role))
    base_id = Column(Integer, ForeignKey("bases.id"), nullable=True)
    base = relationship("BaseLocation")

class Inventory(Base):
    __tablename__ = "inventory"
    id = Column(Integer, primary_key=True, index=True)
    base_id = Column(Integer, ForeignKey("bases.id"))
    asset_type_id = Column(Integer, ForeignKey("asset_types.id"))
    quantity = Column(Integer, default=0)
    asset = relationship("AssetType")
    base = relationship("BaseLocation")

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    type = Column(Enum(TransactionType))
    quantity = Column(Integer)
    asset_type_id = Column(Integer, ForeignKey("asset_types.id"))
    source_base_id = Column(Integer, ForeignKey("bases.id"), nullable=True)
    dest_base_id = Column(Integer, ForeignKey("bases.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"))