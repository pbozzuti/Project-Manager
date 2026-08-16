def test_no_announcement_by_default(client, auth_headers):
    res = client.get("/announcement", headers=auth_headers)
    assert res.status_code == 200
    assert res.json() is None


def test_set_then_get_announcement(client, auth_headers):
    res = client.put("/announcement", json={"message": "Auditions Aug 20-22"}, headers=auth_headers)
    assert res.status_code == 200
    assert res.json()["message"] == "Auditions Aug 20-22"

    res = client.get("/announcement", headers=auth_headers)
    assert res.json()["message"] == "Auditions Aug 20-22"


def test_records_author_from_verified_token_not_request_body(client, auth_headers):
    # auth_headers is signed for tester@adamstheatrecompany.com / "Tester" —
    # confirm that identity is what gets recorded, even if the caller tries
    # to claim a different author in the request body.
    res = client.put(
        "/announcement",
        json={"message": "Hi", "author_name": "Someone Else", "author_email": "spoofed@x.com"},
        headers=auth_headers,
    )
    assert res.status_code == 200
    body = res.json()
    assert body["author_name"] == "Tester"
    assert body["author_email"] == "tester@adamstheatrecompany.com"


def test_reassigns_author_when_a_different_user_updates_it(client):
    import jwt
    import os
    from datetime import datetime, timedelta, timezone

    def token_for(email, name):
        return jwt.encode(
            {"sub": email, "name": name, "exp": datetime.now(timezone.utc) + timedelta(minutes=5)},
            os.environ["AUTH_SECRET"],
            algorithm="HS256",
        )

    client.put(
        "/announcement",
        json={"message": "First"},
        headers={"Authorization": f"Bearer {token_for('paris@adamstheatrecompany.com', 'Paris')}"},
    )
    res = client.put(
        "/announcement",
        json={"message": "Second"},
        headers={"Authorization": f"Bearer {token_for('jamie@adamstheatrecompany.com', 'Jamie')}"},
    )

    assert res.json()["author_name"] == "Jamie"
    assert res.json()["author_email"] == "jamie@adamstheatrecompany.com"


def test_setting_again_upserts_not_duplicates(client, auth_headers):
    first = client.put("/announcement", json={"message": "First"}, headers=auth_headers).json()
    second = client.put("/announcement", json={"message": "Second"}, headers=auth_headers).json()

    assert first["id"] == second["id"]
    assert second["message"] == "Second"


def test_clear_announcement(client, auth_headers):
    client.put("/announcement", json={"message": "Temp"}, headers=auth_headers)
    res = client.delete("/announcement", headers=auth_headers)
    assert res.status_code == 204

    res = client.get("/announcement", headers=auth_headers)
    assert res.json() is None


def test_clear_when_none_set_is_a_harmless_noop(client, auth_headers):
    res = client.delete("/announcement", headers=auth_headers)
    assert res.status_code == 204
