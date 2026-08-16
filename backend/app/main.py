import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import announcement, calendar_events, grants, internal, purchases, tasks, users

app = FastAPI(title="Adams Theatre Company Manager API")

origins = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks.router)
app.include_router(purchases.router)
app.include_router(grants.router)
app.include_router(calendar_events.router)
app.include_router(announcement.router)
app.include_router(users.router)
app.include_router(internal.router)


@app.get("/health")
def health():
    return {"status": "ok"}
