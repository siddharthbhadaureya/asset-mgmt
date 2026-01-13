from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session, joinedload
from jose import JWTError, jwt
from datetime import datetime, timedelta
import models, schemas, database

SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

models.Base.metadata.create_all(bind=database.engine)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None: raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None: raise credentials_exception
    return user

@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or user.password_hash != form_data.password:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user.username, "role": user.role.value})
    return {"access_token": access_token, "token_type": "bearer", "role": user.role.value}

@app.get("/assets")
def get_assets(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.AssetType).all()

@app.get("/stats")
def get_stats(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if not current_user.base_id:
        return {"error": "Global Admin Access"}
    base_id = current_user.base_id
    inventory_items = db.query(models.Inventory) \
        .options(joinedload(models.Inventory.asset)) \
        .filter(models.Inventory.base_id == base_id) \
        .all()
    inventory_list = []
    print("--- DEBUGGING INVENTORY ---")
    for inv in inventory_items:
        print(f"ID: {inv.id}, Asset: {inv.asset.name if inv.asset else 'None'}, Qty: {inv.quantity}")
        inventory_list.append({
            "id": inv.id,
            "asset_type_id": inv.asset_type_id,
            "asset_name": inv.asset.name if inv.asset else "Unknown Asset (DB Error)",
            "quantity": inv.quantity
        })
    incoming = db.query(models.Transaction).filter(models.Transaction.dest_base_id == base_id).all()
    outgoing = db.query(models.Transaction).filter(models.Transaction.source_base_id == base_id).all()
    return {
        "user_role": current_user.role,
        "base_id": base_id,
        "inventory": inventory_list,
        "incoming_count": sum(t.quantity for t in incoming),
        "outgoing_count": sum(t.quantity for t in outgoing),
        "net_movement": sum(t.quantity for t in incoming) - sum(t.quantity for t in outgoing)
    }

@app.post("/transfer")
def transfer_asset(transfer: schemas.TransferRequest, db: Session = Depends(get_db),
                   current_user: models.User = Depends(get_current_user)):
    source_inv = db.query(models.Inventory).filter_by(base_id=transfer.source_base_id,
                                                      asset_type_id=transfer.asset_type_id).first()
    if not source_inv or source_inv.quantity < transfer.quantity:
        raise HTTPException(status_code=400, detail="Insufficient assets")
    source_inv.quantity -= transfer.quantity
    dest_inv = db.query(models.Inventory).filter_by(base_id=transfer.dest_base_id,
                                                    asset_type_id=transfer.asset_type_id).first()
    if dest_inv:
        dest_inv.quantity += transfer.quantity
    else:
        asset_obj = db.query(models.AssetType).get(transfer.asset_type_id)
        base_obj = db.query(models.BaseLocation).get(transfer.dest_base_id)
        db.add(models.Inventory(base=base_obj, asset=asset_obj, quantity=transfer.quantity))
    new_txn = models.Transaction(
        type=models.TransactionType.TRANSFER, quantity=transfer.quantity,
        asset_type_id=transfer.asset_type_id, source_base_id=transfer.source_base_id,
        dest_base_id=transfer.dest_base_id, user_id=current_user.id
    )
    db.add(new_txn)
    db.commit()
    return {"message": "Success"}