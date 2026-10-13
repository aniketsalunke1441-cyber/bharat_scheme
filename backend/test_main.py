# backend/test_main.py
import pytest
from fastapi.testclient import TestClient
from main import app
from schemas import EligibilityProfile
from eligibility_engine import evaluate_scheme_eligibility
from schemes_data import SCHEMES_DATA
from rag_service import rag_service

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["schemes_indexed"] >= 10

def test_categories_endpoint():
    response = client.get("/api/categories")
    assert response.status_code == 200
    cats = response.json()
    assert len(cats) >= 8
    cat_names = [c["id"] for c in cats]
    assert "Education and Scholarships" in cat_names
    assert "Agriculture and Farmers" in cat_names

def test_list_schemes():
    response = client.get("/api/schemes")
    assert response.status_code == 200
    schemes = response.json()
    assert len(schemes) >= 10

def test_scheme_detail():
    response = client.get("/api/schemes/pm-kisan")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "pm-kisan"
    assert "PM-KISAN" in data["title"]
    assert "pmkisan.gov.in" in data["official_portal_url"]
    assert len(data["documents_required"]) > 0

def test_farmer_eligibility_matching():
    """Farmer persona: Age 35, male, Maharashtra, farmer, has landholding -> should match PM-KISAN, PMFBY, KCC."""
    farmer_profile = EligibilityProfile(
        state="Maharashtra",
        district="Nashik",
        age=35,
        gender="male",
        caste_category="OBC",
        occupation="farmer",
        student_status=False,
        annual_income=120000,
        is_farmer=True,
        has_landholding=True,
        language="en"
    )
    response = client.post("/api/eligibility/check", json=farmer_profile.model_dump())
    assert response.status_code == 200
    res = response.json()
    assert res["eligible_count"] > 0
    
    eligible_ids = [r["scheme_id"] for r in res["results"] if r["match_status"] == "ELIGIBLE"]
    assert "pm-kisan" in eligible_ids
    assert "pm-fasal-bima-yojana" in eligible_ids

def test_girl_student_eligibility_matching():
    """Girl student persona: Age 20, female, student, income 3.5 Lakh -> should match Pragati and Central Sector scholarships."""
    student_profile = EligibilityProfile(
        state="Maharashtra",
        district="Pune",
        age=20,
        gender="female",
        caste_category="General",
        occupation="student",
        student_status=True,
        education_level="undergraduate",
        annual_income=350000,
        language="en"
    )
    response = client.post("/api/eligibility/check", json=student_profile.model_dump())
    assert response.status_code == 200
    res = response.json()
    matched_ids = [r["scheme_id"] for r in res["results"] if r["match_status"] in ["ELIGIBLE", "POTENTIALLY_ELIGIBLE"]]
    assert "central-sector-scholarship-pm-usp" in matched_ids
    assert "pm-pragati-scholarship-girls" in matched_ids

def test_maharashtra_woman_scheme():
    """Woman in Maharashtra: Age 32, female, income 1.5 Lakh -> should match Majhi Ladki Bahin."""
    woman_profile = EligibilityProfile(
        state="Maharashtra",
        district="Nagpur",
        age=32,
        gender="female",
        caste_category="General",
        occupation="homemaker",
        annual_income=150000,
        language="mr"
    )
    response = client.post("/api/eligibility/check", json=woman_profile.model_dump())
    assert response.status_code == 200
    res = response.json()
    matched_ids = [r["scheme_id"] for r in res["results"] if r["match_status"] == "ELIGIBLE"]
    assert "majhi-ladki-bahin-maharashtra" in matched_ids

def test_rag_retrieval():
    """Test RAG retrieval for agriculture query."""
    results = rag_service.retrieve("kisan samman nidhi installment ₹6000", top_k=2)
    assert len(results) > 0
    assert results[0]["scheme"]["id"] == "pm-kisan"

def test_rag_assistant_chat_api():
    """Test AI assistant chat endpoint with grounded output."""
    payload = {
        "query": "How do I apply for Ayushman Bharat PM-JAY card?",
        "language": "en"
    }
    response = client.post("/api/assistant/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "answer" in data
    assert len(data["citations"]) > 0
    assert "ayushman" in data["citations"][0]["scheme_id"]
    assert len(data["suggested_followups"]) > 0

def test_saved_schemes_flow():
    """Test save and delete scheme workflow."""
    user_id = "test-device-unique-999"
    save_payload = {
        "user_identifier": user_id,
        "scheme_id": "pm-kisan",
        "notes": "Need to check 7/12 land record"
    }
    # Save
    res1 = client.post("/api/saved-schemes", json=save_payload)
    assert res1.status_code == 200
    
    # Retrieve
    res2 = client.get(f"/api/saved-schemes?user_id={user_id}")
    assert res2.status_code == 200
    saved = res2.json()
    assert len(saved) >= 1
    assert saved[0]["scheme_id"] == "pm-kisan"
    
    # Delete
    res3 = client.delete(f"/api/saved-schemes/pm-kisan?user_id={user_id}")
    assert res3.status_code == 200
