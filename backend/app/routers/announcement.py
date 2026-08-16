from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import models, schemas
from ..auth import CurrentUser, require_user
from ..database import get_db

router = APIRouter(
    prefix="/announcement", tags=["announcement"], dependencies=[Depends(require_user)]
)


@router.get("", response_model=Optional[schemas.AnnouncementOut])
def get_announcement(db: Session = Depends(get_db)):
    return db.query(models.Announcement).first()


@router.put("", response_model=schemas.AnnouncementOut)
def set_announcement(
    payload: schemas.AnnouncementSet,
    current_user: CurrentUser = Depends(require_user),
    db: Session = Depends(get_db),
):
    existing = db.query(models.Announcement).first()
    if existing:
        existing.message = payload.message
    else:
        existing = models.Announcement(message=payload.message)
        db.add(existing)
    # Who pinned it — taken from the verified token, never the request body,
    # so it can't be spoofed by whoever's calling the API.
    existing.author_name = current_user.name
    existing.author_email = current_user.email
    db.commit()
    db.refresh(existing)
    return existing


@router.delete("", status_code=204)
def clear_announcement(db: Session = Depends(get_db)):
    existing = db.query(models.Announcement).first()
    if existing:
        db.delete(existing)
        db.commit()
