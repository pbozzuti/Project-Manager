import os
from datetime import datetime, timedelta, timezone
from pathlib import Path

# Must happen before any `app.*` import — database.py reads DATABASE_URL at
# import time, and we never want tests touching the real Supabase database.
TEST_DB_PATH = Path(__file__).resolve().parent / "test.db"
if TEST_DB_PATH.exists():
    TEST_DB_PATH.unlink()

os.environ["DATABASE_URL"] = f"sqlite:///{TEST_DB_PATH}"
os.environ["AUTH_SECRET"] = "test-auth-secret-not-for-real-use"
os.environ["INTERNAL_API_SECRET"] = "test-internal-secret-not-for-real-use"

import jwt
import pytest
from fastapi.testclient import TestClient

from app.database import Base, engine
from app.main import app


@pytest.fixture(autouse=True)
def reset_db():
    """Fresh schema before every test, so tests can't see each other's data."""
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield


@pytest.fixture()
def client():
    return TestClient(app)


def make_token(email: str = "tester@adamstheatrecompany.com", name: str = "Tester") -> str:
    return jwt.encode(
        {
            "sub": email,
            "name": name,
            "exp": datetime.now(timezone.utc) + timedelta(minutes=30),
        },
        os.environ["AUTH_SECRET"],
        algorithm="HS256",
    )


@pytest.fixture()
def auth_headers():
    return {"Authorization": f"Bearer {make_token()}"}


@pytest.fixture()
def internal_headers():
    return {"X-Internal-Secret": os.environ["INTERNAL_API_SECRET"]}


@pytest.fixture(scope="session", autouse=True)
def cleanup_test_db():
    yield
    if TEST_DB_PATH.exists():
        TEST_DB_PATH.unlink()
