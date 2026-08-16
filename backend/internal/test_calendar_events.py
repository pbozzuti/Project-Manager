def test_create_and_list_sorted_by_date(client, auth_headers):
    client.post(
        "/calendar-events", json={"title": "Later event", "date": "2026-10-01"}, headers=auth_headers
    )
    client.post(
        "/calendar-events", json={"title": "Sooner event", "date": "2026-09-01"}, headers=auth_headers
    )

    res = client.get("/calendar-events", headers=auth_headers)
    assert res.status_code == 200
    titles = [e["title"] for e in res.json()]
    assert titles == ["Sooner event", "Later event"]


def test_delete_event(client, auth_headers):
    created = client.post(
        "/calendar-events", json={"title": "Board meeting", "date": "2026-08-24"}, headers=auth_headers
    ).json()

    res = client.delete(f"/calendar-events/{created['id']}", headers=auth_headers)
    assert res.status_code == 204
    assert client.get("/calendar-events", headers=auth_headers).json() == []


def test_delete_missing_event_404s(client, auth_headers):
    res = client.delete(
        "/calendar-events/00000000-0000-0000-0000-000000000000", headers=auth_headers
    )
    assert res.status_code == 404
