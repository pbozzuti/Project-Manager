import uuid
from typing import Literal, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import asc
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/tasks", tags=["tasks"])

SORT_COLUMNS = {
    "assignee": models.Task.assignee,
    "project": models.Task.project,
    "deadline": models.Task.deadline,
    "created_at": models.Task.created_at,
}


@router.get("", response_model=list[schemas.TaskOut])
def list_tasks(
    sort_by: Literal["assignee", "project", "deadline", "created_at"] = "created_at",
    assignee: Optional[str] = None,
    project: Optional[str] = None,
    status: Optional[models.TaskStatus] = None,
    db: Session = Depends(get_db),
):
    query = db.query(models.Task)
    if assignee:
        query = query.filter(models.Task.assignee == assignee)
    if project:
        query = query.filter(models.Task.project == project)
    if status:
        query = query.filter(models.Task.status == status)
    return query.order_by(asc(SORT_COLUMNS[sort_by])).all()


@router.post("", response_model=schemas.TaskOut, status_code=201)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    db_task = models.Task(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


@router.patch("/{task_id}", response_model=schemas.TaskOut)
def update_task(task_id: uuid.UUID, task: schemas.TaskUpdate, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    for field, value in task.model_dump(exclude_unset=True).items():
        setattr(db_task, field, value)
    db.commit()
    db.refresh(db_task)
    return db_task


@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: uuid.UUID, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(db_task)
    db.commit()
