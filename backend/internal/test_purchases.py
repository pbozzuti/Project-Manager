def test_create_and_list_purchase(client, auth_headers):
    res = client.post(
        "/purchases",
        json={
            "item": "Stage paint",
            "amount": 84.5,
            "purchaser": "Paris",
            "project": "Fall Show",
            "date": "2026-08-05",
        },
        headers=auth_headers,
    )
    assert res.status_code == 201
    assert res.json()["amount"] == 84.5

    res = client.get("/purchases", headers=auth_headers)
    assert len(res.json()) == 1


def test_update_purchase(client, auth_headers):
    created = client.post(
        "/purchases",
        json={"item": "Tape", "amount": 5, "purchaser": "Will", "project": "Misc", "date": "2026-08-01"},
        headers=auth_headers,
    ).json()

    res = client.patch(f"/purchases/{created['id']}", json={"amount": 7.5}, headers=auth_headers)
    assert res.status_code == 200
    assert res.json()["amount"] == 7.5


def test_delete_purchase(client, auth_headers):
    created = client.post(
        "/purchases",
        json={"item": "Temp", "amount": 1, "purchaser": "Will", "project": "Misc", "date": "2026-08-01"},
        headers=auth_headers,
    ).json()

    res = client.delete(f"/purchases/{created['id']}", headers=auth_headers)
    assert res.status_code == 204
    assert client.get("/purchases", headers=auth_headers).json() == []


def test_filter_by_project(client, auth_headers):
    client.post(
        "/purchases",
        json={"item": "A", "amount": 1, "purchaser": "Paris", "project": "Fall Show", "date": "2026-08-01"},
        headers=auth_headers,
    )
    client.post(
        "/purchases",
        json={"item": "B", "amount": 1, "purchaser": "Paris", "project": "Spring Show", "date": "2026-08-01"},
        headers=auth_headers,
    )

    res = client.get("/purchases?project=Fall Show", headers=auth_headers)
    assert [p["item"] for p in res.json()] == ["A"]
