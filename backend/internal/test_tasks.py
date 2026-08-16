def test_create_and_list_task(client, auth_headers):
    res = client.post(
        "/tasks",
        json={"title": "Book venue", "assignee": "Paris", "project": "Fall Show", "deadline": "2026-09-01"},
        headers=auth_headers,
    )
    assert res.status_code == 201
    body = res.json()
    assert body["title"] == "Book venue"
    assert body["status"] == "todo"

    res = client.get("/tasks", headers=auth_headers)
    assert res.status_code == 200
    assert len(res.json()) == 1


def test_update_task_status(client, auth_headers):
    created = client.post(
        "/tasks",
        json={"title": "Design poster", "assignee": "Jamie", "project": "Fall Show"},
        headers=auth_headers,
    ).json()

    res = client.patch(
        f"/tasks/{created['id']}",
        json={"status": "in_progress"},
        headers=auth_headers,
    )
    assert res.status_code == 200
    assert res.json()["status"] == "in_progress"
    # Untouched fields survive a partial update.
    assert res.json()["title"] == "Design poster"


def test_update_missing_task_404s(client, auth_headers):
    res = client.patch(
        "/tasks/00000000-0000-0000-0000-000000000000",
        json={"status": "done"},
        headers=auth_headers,
    )
    assert res.status_code == 404


def test_delete_task(client, auth_headers):
    created = client.post(
        "/tasks",
        json={"title": "Temp task", "assignee": "Will", "project": "Misc"},
        headers=auth_headers,
    ).json()

    res = client.delete(f"/tasks/{created['id']}", headers=auth_headers)
    assert res.status_code == 204

    res = client.get("/tasks", headers=auth_headers)
    assert res.json() == []


def test_filter_by_assignee_and_project(client, auth_headers):
    client.post(
        "/tasks", json={"title": "A", "assignee": "Paris", "project": "Fall Show"}, headers=auth_headers
    )
    client.post(
        "/tasks", json={"title": "B", "assignee": "Jamie", "project": "Spring Show"}, headers=auth_headers
    )

    res = client.get("/tasks?assignee=Paris", headers=auth_headers)
    assert [t["title"] for t in res.json()] == ["A"]

    res = client.get("/tasks?project=Spring Show", headers=auth_headers)
    assert [t["title"] for t in res.json()] == ["B"]


def test_sort_by_deadline(client, auth_headers):
    client.post(
        "/tasks",
        json={"title": "Later", "assignee": "Paris", "project": "X", "deadline": "2026-10-01"},
        headers=auth_headers,
    )
    client.post(
        "/tasks",
        json={"title": "Sooner", "assignee": "Paris", "project": "X", "deadline": "2026-09-01"},
        headers=auth_headers,
    )

    res = client.get("/tasks?sort_by=deadline", headers=auth_headers)
    titles = [t["title"] for t in res.json()]
    assert titles == ["Sooner", "Later"]
