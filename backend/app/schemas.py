import uuid
from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from .models import TaskStatus


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    assignee: str
    project: str
    link: Optional[str] = None
    deadline: Optional[date] = None
    status: TaskStatus = TaskStatus.todo


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    assignee: Optional[str] = None
    project: Optional[str] = None
    link: Optional[str] = None
    deadline: Optional[date] = None
    status: Optional[TaskStatus] = None


class TaskOut(TaskBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class PurchaseBase(BaseModel):
    item: str
    amount: float
    purchaser: str
    project: str
    category: Optional[str] = None
    date: date
    notes: Optional[str] = None


class PurchaseCreate(PurchaseBase):
    pass


class PurchaseUpdate(BaseModel):
    item: Optional[str] = None
    amount: Optional[float] = None
    purchaser: Optional[str] = None
    project: Optional[str] = None
    category: Optional[str] = None
    date: Optional[date] = None
    notes: Optional[str] = None


class PurchaseOut(PurchaseBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class UserUpsert(BaseModel):
    email: str
    name: Optional[str] = None
    picture: Optional[str] = None


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: str
    name: Optional[str] = None
    picture: Optional[str] = None
    created_at: datetime
    last_login_at: datetime


class CalendarEventBase(BaseModel):
    title: str
    date: date
    description: Optional[str] = None


class CalendarEventCreate(CalendarEventBase):
    pass


class CalendarEventOut(CalendarEventBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    created_at: datetime


class AnnouncementSet(BaseModel):
    message: str


class AnnouncementOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    message: str
    author_name: Optional[str] = None
    author_email: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class GrantOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    source: str
    program_name: str
    url: str
    status_text: Optional[str] = None
    deadline_text: Optional[str] = None
    contact_email: Optional[str] = None
    summary: Optional[str] = None
    scraped_at: datetime
