def test_upsert_creates_user(client, internal_headers):
    res = client.post(
        "/users/upsert",
        json={"email": "paris@adamstheatrecompany.com", "name": "Paris", "picture": "https://x/p.jpg"},
        headers=internal_headers,
    )
    assert res.status_code == 200
    body = res.json()
    assert body["email"] == "paris@adamstheatrecompany.com"
    assert body["name"] == "Paris"


def test_upsert_same_email_updates_not_duplicates(client, internal_headers):
    first = client.post(
        "/users/upsert", json={"email": "x@adamstheatrecompany.com", "name": "Old Name"}, headers=internal_headers
    ).json()
    second = client.post(
        "/users/upsert", json={"email": "x@adamstheatrecompany.com", "name": "New Name"}, headers=internal_headers
    ).json()

    assert first["id"] == second["id"]
    assert second["name"] == "New Name"


def test_list_users(client, auth_headers, internal_headers):
    client.post("/users/upsert", json={"email": "a@adamstheatrecompany.com", "name": "A"}, headers=internal_headers)
    client.post("/users/upsert", json={"email": "b@adamstheatrecompany.com", "name": "B"}, headers=internal_headers)

    res = client.get("/users", headers=auth_headers)
    assert res.status_code == 200
    assert len(res.json()) == 2
