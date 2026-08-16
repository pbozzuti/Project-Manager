import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import asc
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/calendar-events", tags=["calendar-events"])


@router.get("", response_model=list[schemas.CalendarEventOut])
def list_calendar_events(db: Session = Depends(get_db)):
    return db.query(models.CalendarEvent).order_by(asc(models.CalendarEvent.date)).all()


@router.post("", response_model=schemas.CalendarEventOut, status_code=201)
def create_calendar_event(event: schemas.CalendarEventCreate, db: Session = Depends(get_db)):
    db_event = models.CalendarEvent(**event.model_dump())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


@router.delete("/{event_id}", status_code=204)
def delete_calendar_event(event_id: uuid.UUID, db: Session = Depends(get_db)):
    db_event = db.query(models.CalendarEvent).filter(models.CalendarEvent.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(db_event)
    db.commit()
