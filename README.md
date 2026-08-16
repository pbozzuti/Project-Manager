# Adams Theatre Company — Manager App

First prototype: a Jira-style task board (create/assign tasks, track status, sort by person/project/deadline). Other pages from the spec (finance, calendar, event/grant scrapers, login) aren't built yet.

## Stack

- **Frontend**: Next.js (App Router) + Tailwind CSS — `frontend/`
- **Backend**: FastAPI — `backend/`
- **Database**: SQLite locally out of the box; swap in Supabase Postgres by setting `DATABASE_URL` (see `backend/.env.example`)

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

Open http://localhost:3000. The frontend expects the API at `http://localhost:8000` (see `frontend/.env.local`).

## Moving to Supabase

1. Create a free project at supabase.com.
2. Project Settings → Database → Connection string (URI, "Session pooler"). Copy it into `backend/.env` as `DATABASE_URL` (change `postgres://` to `postgresql://`).
3. Restart the backend — tables are created automatically on startup (`Base.metadata.create_all`).
4. Supabase Auth (Google sign-in restricted to your ATC domain) is the natural next step once login is built.

## Next steps (per spec)

- Home hub + nav shell, Google login restricted to the ATC email domain
- Finance page: purchase tracking + grant web scraper
- Calendar page
- Event page: Chicago venue scraper
