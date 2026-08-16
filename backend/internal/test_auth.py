import os
from datetime import datetime, timedelta, timezone

import jwt


def test_rejects_missing_token(client):
    res = client.get("/tasks")
    assert res.status_code == 401


def test_rejects_malformed_header(client):
    res = client.get("/tasks", headers={"Authorization": "not-a-bearer-token"})
    assert res.status_code == 401


def test_rejects_garbage_token(client):
    res = client.get("/tasks", headers={"Authorization": "Bearer garbage"})
    assert res.status_code == 401


def test_rejects_token_signed_with_wrong_secret(client):
    bad_token = jwt.encode(
        {"sub": "tester@adamstheatrecompany.com", "exp": datetime.now(timezone.utc) + timedelta(minutes=5)},
        "wrong-secret",
        algorithm="HS256",
    )
    res = client.get("/tasks", headers={"Authorization": f"Bearer {bad_token}"})
    assert res.status_code == 401


def test_rejects_expired_token(client):
    expired = jwt.encode(
        {"sub": "tester@adamstheatrecompany.com", "exp": datetime.now(timezone.utc) - timedelta(minutes=1)},
        os.environ["AUTH_SECRET"],
        algorithm="HS256",
    )
    res = client.get("/tasks", headers={"Authorization": f"Bearer {expired}"})
    assert res.status_code == 401


def test_accepts_valid_token(client, auth_headers):
    res = client.get("/tasks", headers=auth_headers)
    assert res.status_code == 200


def test_health_stays_open(client):
    # No auth header at all — the liveness check must not require sign-in.
    res = client.get("/health")
    assert res.status_code == 200


def test_upsert_rejects_missing_internal_secret(client):
    res = client.post("/users/upsert", json={"email": "x@adamstheatrecompany.com"})
    assert res.status_code == 401


def test_upsert_rejects_wrong_internal_secret(client):
    res = client.post(
        "/users/upsert",
        json={"email": "x@adamstheatrecompany.com"},
        headers={"X-Internal-Secret": "not-the-real-secret"},
    )
    assert res.status_code == 401


def test_upsert_accepts_correct_internal_secret(client, internal_headers):
    res = client.post(
        "/users/upsert",
        json={"email": "x@adamstheatrecompany.com", "name": "X"},
        headers=internal_headers,
    )
    assert res.status_code == 200


def test_a_users_bearer_token_does_not_work_for_upsert(client, auth_headers):
    # The two secrets are intentionally separate — a per-user token shouldn't
    # also authorize the server-to-server sync endpoint.
    res = client.post(
        "/users/upsert",
        json={"email": "x@adamstheatrecompany.com"},
        headers=auth_headers,
    )
    assert res.status_code == 401
