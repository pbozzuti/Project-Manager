import os

import jwt
from fastapi import Header, HTTPException
from pydantic import BaseModel

AUTH_SECRET = os.getenv("AUTH_SECRET")
INTERNAL_API_SECRET = os.getenv("INTERNAL_API_SECRET")


class CurrentUser(BaseModel):
    email: str
    name: str | None = None


def require_user(authorization: str = Header(default="")) -> CurrentUser:
    """Verifies the short-lived per-user JWT minted by the Next.js /api/token
    route. Every data-bearing endpoint depends on this — it's what actually
    stops someone from hitting the API directly and skipping sign-in."""
    if not AUTH_SECRET:
        raise HTTPException(status_code=500, detail="AUTH_SECRET not configured on the backend")

    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")

    token = authorization.removeprefix("Bearer ").strip()
    try:
        payload = jwt.decode(token, AUTH_SECRET, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="Token missing subject")

    return CurrentUser(email=email, name=payload.get("name"))


def require_internal_service(x_internal_secret: str = Header(default="")) -> None:
    """For server-to-server calls from the Next.js backend itself (currently
    just the sign-in user-sync) — not tied to a specific person's session,
    just proves the caller is our own Next.js server, not a stranger."""
    if not INTERNAL_API_SECRET:
        raise HTTPException(status_code=500, detail="INTERNAL_API_SECRET not configured on the backend")
    if x_internal_secret != INTERNAL_API_SECRET:
        raise HTTPException(status_code=401, detail="Invalid internal service secret")
