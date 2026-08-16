import subprocess
import sys
from pathlib import Path

from fastapi import APIRouter, Depends

from ..auth import require_user

router = APIRouter(prefix="/internal", tags=["internal"], dependencies=[Depends(require_user)])

BACKEND_ROOT = Path(__file__).resolve().parent.parent.parent


def _parse_summary(output: str) -> str:
    for line in reversed(output.strip().splitlines()):
        if "passed" in line or "failed" in line or "error" in line:
            return line.strip("= ").strip()
    return "No summary line found"


@router.post("/run-tests")
def run_tests():
    # A genuine subprocess, not an in-process pytest run — conftest.py
    # overrides DATABASE_URL to an isolated SQLite file before any app
    # module is imported, but that only works cleanly in a fresh process,
    # since this server's own process already has the real engine loaded.
    try:
        result = subprocess.run(
            [sys.executable, "-m", "pytest", "internal/", "-v", "--tb=short"],
            cwd=BACKEND_ROOT,
            capture_output=True,
            text=True,
            timeout=60,
        )
    except subprocess.TimeoutExpired:
        return {"passed": False, "summary": "Test run timed out after 60s", "output": ""}

    output = result.stdout + result.stderr
    return {
        "passed": result.returncode == 0,
        "summary": _parse_summary(output),
        "output": output,
    }
