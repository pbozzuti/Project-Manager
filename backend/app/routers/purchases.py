import uuid
from typing import Literal, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import asc, desc
from sqlalchemy.orm import Session

from .. import models, schemas
from ..auth import require_user
from ..database import get_db

router = APIRouter(prefix="/purchases", tags=["purchases"], dependencies=[Depends(require_user)])

SORT_COLUMNS = {
    "date": models.Purchase.date,
    "amount": models.Purchase.amount,
    "purchaser": models.Purchase.purchaser,
    "project": models.Purchase.project,
    "created_at": models.Purchase.created_at,
}


@router.get("", response_model=list[schemas.PurchaseOut])
def list_purchases(
    sort_by: Literal["date", "amount", "purchaser", "project", "created_at"] = "date",
    purchaser: Optional[str] = None,
    project: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(models.Purchase)
    if purchaser:
        query = query.filter(models.Purchase.purchaser == purchaser)
    if project:
        query = query.filter(models.Purchase.project == project)
    return query.order_by(desc(SORT_COLUMNS[sort_by])).all()


@router.post("", response_model=schemas.PurchaseOut, status_code=201)
def create_purchase(purchase: schemas.PurchaseCreate, db: Session = Depends(get_db)):
    db_purchase = models.Purchase(**purchase.model_dump())
    db.add(db_purchase)
    db.commit()
    db.refresh(db_purchase)
    return db_purchase


@router.patch("/{purchase_id}", response_model=schemas.PurchaseOut)
def update_purchase(purchase_id: uuid.UUID, purchase: schemas.PurchaseUpdate, db: Session = Depends(get_db)):
    db_purchase = db.query(models.Purchase).filter(models.Purchase.id == purchase_id).first()
    if not db_purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")
    for field, value in purchase.model_dump(exclude_unset=True).items():
        setattr(db_purchase, field, value)
    db.commit()
    db.refresh(db_purchase)
    return db_purchase


@router.delete("/{purchase_id}", status_code=204)
def delete_purchase(purchase_id: uuid.UUID, db: Session = Depends(get_db)):
    db_purchase = db.query(models.Purchase).filter(models.Purchase.id == purchase_id).first()
    if not db_purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")
    db.delete(db_purchase)
    db.commit()
