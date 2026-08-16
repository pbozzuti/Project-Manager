import enum
import uuid

from sqlalchemy import Column, Date, DateTime, Enum, Float, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.types import TypeDecorator, CHAR

from .database import Base, engine


class GUID(TypeDecorator):
    """Platform-independent UUID: Postgres UUID type, CHAR(36) elsewhere (SQLite)."""

    impl = CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == "postgresql":
            return dialect.type_descriptor(UUID())
        return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        return uuid.UUID(str(value))


class TaskStatus(str, enum.Enum):
    todo = "todo"
    in_progress = "in_progress"
    done = "done"


class Task(Base):
    __tablename__ = "tasks"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    assignee = Column(String, nullable=False)
    project = Column(String, nullable=False)
    link = Column(String, nullable=True)
    deadline = Column(Date, nullable=True)
    status = Column(Enum(TaskStatus), nullable=False, default=TaskStatus.todo)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Purchase(Base):
    __tablename__ = "purchases"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    item = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    purchaser = Column(String, nullable=False)
    project = Column(String, nullable=False)
    category = Column(String, nullable=True)
    date = Column(Date, nullable=False)
    notes = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Grant(Base):
    __tablename__ = "grants"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    source = Column(String, nullable=False, default="DCASE")
    program_name = Column(String, nullable=False)
    url = Column(String, nullable=False, unique=True)
    status_text = Column(String, nullable=True)
    deadline_text = Column(String, nullable=True)
    contact_email = Column(String, nullable=True)
    summary = Column(String, nullable=True)
    scraped_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())


class CalendarEvent(Base):
    __tablename__ = "calendar_events"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    date = Column(Date, nullable=False)
    description = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Announcement(Base):
    __tablename__ = "announcement"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    message = Column(String, nullable=False)
    author_name = Column(String, nullable=True)
    author_email = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class User(Base):
    __tablename__ = "users"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    email = Column(String, nullable=False, unique=True)
    name = Column(String, nullable=True)
    picture = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    last_login_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


Base.metadata.create_all(bind=engine)
