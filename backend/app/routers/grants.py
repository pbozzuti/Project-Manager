from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..scraper.dcase import scrape_dcase

router = APIRouter(prefix="/grants", tags=["grants"])


@router.get("", response_model=list[schemas.GrantOut])
def list_grants(db: Session = Depends(get_db)):
    return db.query(models.Grant).order_by(models.Grant.program_name).all()


@router.post("/refresh")
def refresh_grants(db: Session = Depends(get_db)):
    results, errors = scrape_dcase()

    for item in results:
        existing = db.query(models.Grant).filter(models.Grant.url == item["url"]).first()
        if existing:
            for field, value in item.items():
                setattr(existing, field, value)
        else:
            db.add(models.Grant(**item))
    db.commit()

    grants = db.query(models.Grant).order_by(models.Grant.program_name).all()
    return {
        "grants": [schemas.GrantOut.model_validate(g) for g in grants],
        "errors": errors,
    }
