from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import models, schemas
from ..auth import require_internal_service, require_user
from ..database import get_db

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=list[schemas.UserOut], dependencies=[Depends(require_user)])
def list_users(db: Session = Depends(get_db)):
    return db.query(models.User).order_by(models.User.name).all()


@router.post(
    "/upsert",
    response_model=schemas.UserOut,
    dependencies=[Depends(require_internal_service)],
)
def upsert_user(payload: schemas.UserUpsert, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == payload.email).first()
    if existing:
        existing.name = payload.name
        existing.picture = payload.picture
    else:
        existing = models.User(email=payload.email, name=payload.name, picture=payload.picture)
        db.add(existing)
    db.commit()
    db.refresh(existing)
    return existing
