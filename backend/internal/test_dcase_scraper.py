from bs4 import BeautifulSoup

from app.scraper.dcase import (
    _extract_deadline,
    _extract_email,
    _extract_status,
    _extract_summary,
)

SAMPLE_PAGE = """
<html>
<body>
  <h1 class="page-heading">CityArts Program</h1>
  <div class="cds-alert-section">
    <div class="alert-content">
      <p><strong>The 2026 CityArts Program application is now closed.</strong></p>
    </div>
  </div>
  <p>Short nav text</p>
  <p>The City of Chicago Department of Cultural Affairs and Special Events (DCASE)
     supports artists and cultural organizations across the city.</p>
  <table>
    <tr><td><strong>Event</strong></td><td><strong>Dates</strong></td></tr>
    <tr><td><strong>Application Deadline</strong></td><td>Wednesday, June 3, 2026 at noon CT</td></tr>
    <tr><td><strong>Notification of Results</strong></td><td>September 2026</td></tr>
  </table>
  <p>Please email CulturalGrantMaking@cityofchicago.org for questions.</p>
</body>
</html>
"""


def soup():
    return BeautifulSoup(SAMPLE_PAGE, "html.parser")


def test_extracts_status_from_alert_box():
    assert _extract_status(soup()) == "The 2026 CityArts Program application is now closed."


def test_extracts_deadline_from_timeline_table():
    assert _extract_deadline(soup()) == "Wednesday, June 3, 2026 at noon CT"


def test_extracts_dcase_email_preferentially():
    assert _extract_email(soup()) == "CulturalGrantMaking@cityofchicago.org"


def test_extracts_first_substantial_paragraph_as_summary():
    summary = _extract_summary(soup())
    assert summary is not None
    assert "DCASE" in summary
    assert summary != "Short nav text"  # too short to count, should be skipped


def test_missing_alert_box_returns_none_not_error():
    minimal = BeautifulSoup("<html><body><h1 class='page-heading'>X</h1></body></html>", "html.parser")
    assert _extract_status(minimal) is None
    assert _extract_deadline(minimal) is None
    assert _extract_email(minimal) is None
    assert _extract_summary(minimal) is None
