import re
from datetime import datetime, timezone

import requests
from bs4 import BeautifulSoup

# DCASE doesn't publish one master list of open grants — each program has its
# own page under the Cultural Grants "For Applicants" menu. Hardcoded because
# there's no index page to discover these from programmatically.
PROGRAM_PAGES = [
    ("Chicago Presents", "https://www.chicago.gov/city/en/depts/dca/supp_info/chicago_presents.html"),
    ("CityArts Program", "https://www.chicago.gov/city/en/depts/dca/supp_info/cityarts.html"),
    ("Individual Artists Program (IAP)", "https://www.chicago.gov/city/en/depts/dca/supp_info/iap.html"),
    ("Neighborhood Access Program (NAP)", "https://www.chicago.gov/city/en/depts/dca/supp_info/nap.html"),
    ("Next Stage Chicago", "https://www.chicago.gov/city/en/depts/dca/supp_info/next_stage.html"),
]

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    )
}

EMAIL_RE = re.compile(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+")


def _extract_status(soup: BeautifulSoup) -> str | None:
    alert = soup.select_one(".cds-alert-section .alert-content")
    if not alert:
        return None
    text = alert.get_text(" ", strip=True)
    return text or None


def _extract_deadline(soup: BeautifulSoup) -> str | None:
    for row in soup.select("table tr"):
        cells = row.find_all("td")
        if len(cells) < 2:
            continue
        label = cells[0].get_text(" ", strip=True)
        if "deadline" in label.lower():
            return cells[1].get_text(" ", strip=True)
    return None


def _extract_email(soup: BeautifulSoup) -> str | None:
    text = soup.get_text(" ", strip=True)
    matches = EMAIL_RE.findall(text)
    for m in matches:
        if "cityofchicago.org" in m.lower():
            return m
    return matches[0] if matches else None


def _extract_summary(soup: BeautifulSoup) -> str | None:
    for p in soup.find_all("p"):
        text = p.get_text(" ", strip=True)
        if len(text) > 60:
            return text
    return None


def fetch_program(name: str, url: str) -> dict:
    resp = requests.get(url, headers=HEADERS, timeout=15)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")

    heading = soup.select_one("h1.page-heading")
    program_name = heading.get_text(strip=True) if heading else name

    return {
        "source": "DCASE",
        "program_name": program_name,
        "url": url,
        "status_text": _extract_status(soup),
        "deadline_text": _extract_deadline(soup),
        "contact_email": _extract_email(soup),
        "summary": _extract_summary(soup),
        "scraped_at": datetime.now(timezone.utc),
    }


def scrape_dcase() -> tuple[list[dict], list[str]]:
    """Returns (results, errors). One page failing doesn't stop the rest."""
    results = []
    errors = []
    for name, url in PROGRAM_PAGES:
        try:
            results.append(fetch_program(name, url))
        except Exception as exc:  # noqa: BLE001 - one bad page shouldn't kill the scrape
            errors.append(f"{name}: {exc}")
    return results, errors
