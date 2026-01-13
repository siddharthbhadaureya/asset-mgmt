from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum

class TransactionType(str, Enum):
    PURCHASE = "PURCHASE"
    TRANSFER = "TRANSFER"
    ASSIGN = "ASSIGN"
    EXPEND = "EXPEND"

class InventoryBase(BaseModel):
    quantity: int

class TransactionBase(BaseModel):
    type: TransactionType
    quantity: int
    asset_type_id: int
    source_base_id: Optional[int] = None
    dest_base_id: Optional[int] = None
    user_id: int

class TransferRequest(BaseModel):
    asset_type_id: int
    source_base_id: int
    dest_base_id: int
    quantity: int
    user_id: int

class TransactionResponse(TransactionBase):
    id: int
    timestamp: datetime
    class Config:
        from_attributes = True