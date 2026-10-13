import urllib.request
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

def test_endpoints():
    # 1. Health
    res = urllib.request.urlopen("http://127.0.0.1:8000/api/health")
    health = json.loads(res.read().decode())
    print("Health check:", health)

    # 2. Categories
    res = urllib.request.urlopen("http://127.0.0.1:8000/api/categories")
    cats = json.loads(res.read().decode())
    print(f"Categories loaded: {len(cats)} categories")

    # 3. Eligibility Check for Farmer
    profile = {
        "state": "Maharashtra",
        "district": "Pune",
        "age": 32,
        "gender": "male",
        "caste_category": "OBC",
        "occupation": "farmer",
        "student_status": False,
        "annual_income": 150000,
        "is_farmer": True,
        "has_landholding": True,
        "language": "en"
    }
    req = urllib.request.Request(
        "http://127.0.0.1:8000/api/eligibility/check",
        data=json.dumps(profile).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    res = urllib.request.urlopen(req)
    eligibility = json.loads(res.read().decode())
    print(f"Eligibility results: {eligibility['eligible_count']} Eligible, {eligibility['potentially_eligible_count']} Potential")

    # 4. RAG Chat
    chat_payload = {
        "query": "Tell me about PM-KISAN scheme and who gets ₹6000",
        "language": "en"
    }
    req = urllib.request.Request(
        "http://127.0.0.1:8000/api/assistant/chat",
        data=json.dumps(chat_payload).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    res = urllib.request.urlopen(req)
    chat_res = json.loads(res.read().decode())
    print("RAG Answer Preview:\n", chat_res['answer'][:200], "...")
    print(f"Citations count: {len(chat_res['citations'])}")

if __name__ == "__main__":
    test_endpoints()
