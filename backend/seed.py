from database import SessionLocal, engine
import models
from models import Role

# 1. Create Tables
models.Base.metadata.create_all(bind=engine)
db = SessionLocal()

def seed_data():
    db.query(models.Transaction).delete()
    db.query(models.Inventory).delete()
    db.query(models.User).delete()
    db.query(models.AssetType).delete()
    db.query(models.BaseLocation).delete()
    db.commit()
    print("Seeding Defense Assets...")

    base_delhi = models.BaseLocation(name="HQ Northern Command (Udhampur)", location="J&K")
    base_mumbai = models.BaseLocation(name="INS Hamla (Mumbai)", location="Maharashtra")
    rifle = models.AssetType(name="INSAS Excalibur Rifle", category="Weapon")
    tank = models.AssetType(name="Arjun MBT Mk-1A", category="Vehicle")
    missile = models.AssetType(name="BrahMos Missile", category="Ordnance")
    jet = models.AssetType(name="HAL Tejas Mk1", category="Aircraft")
    admin = models.User(username="admin", password_hash="admin123", role=Role.ADMIN)
    cmdr_north = models.User(username="cmdr_north", password_hash="pass123", role=Role.COMMANDER,
                             base=base_delhi)
    log_west = models.User(username="log_west", password_hash="pass123", role=Role.LOGISTICS,
                           base=base_mumbai)
    inv1 = models.Inventory(base=base_delhi, asset=rifle, quantity=500)
    inv2 = models.Inventory(base=base_delhi, asset=tank, quantity=15)
    inv3 = models.Inventory(base=base_mumbai, asset=missile, quantity=5)

    db.add_all([base_delhi, base_mumbai])
    db.add_all([rifle, tank, missile, jet])
    db.add_all([admin, cmdr_north, log_west])
    db.add_all([inv1, inv2, inv3])
    db.commit()
    print("Seeding Complete! Login with 'cmdr_north' / 'pass123'")

if __name__ == "__main__":
    seed_data()
    db.close()