# Adams Theatre Company — Manager App

First prototype: a Jira-style task board (create/assign tasks, track status, sort by person/project/deadline). Other pages from the spec (finance, calendar, event/grant scrapers, login) aren't built yet.

## Stack

- **Frontend**: Next.js (App Router) + Tailwind CSS — `frontend/`
- **Backend**: FastAPI — `backend/`
- **Database**: SQLite locally for now

## Running locally

**Backend** (from `backend/`):
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend** (from `frontend/`, separate terminal):
```bash
npm install
npm run dev
```