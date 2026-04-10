import requests

BASE_URL = "http://localhost:8000/api"

# 1. Lấy session_id
start_res = requests.post(f"{BASE_URL}/story/start", json={"story_id": "forest"})
session_id = start_res.json()["session_id"]
print(f"session_id: {session_id}")

# 2. Test adapt - pass
res = requests.post(f"{BASE_URL}/story/adapt", json={
    "session_id": session_id,
    "verify_result": "pass",
    "segment_index": 0
})
print(f"\nadapt pass: {res.json()}")

# 3. Test badge
res = requests.get(f"{BASE_URL}/story/badge", params={"session_id": session_id})
print(f"\nbadge: {res.json()}")

# 4. Test adapt - retry
res = requests.post(f"{BASE_URL}/story/adapt", json={
    "session_id": session_id,
    "verify_result": "retry",
    "segment_index": 1
})
print(f"\nadapt retry: {res.json()}")

# 5. Test adapt - fail
res = requests.post(f"{BASE_URL}/story/adapt", json={
    "session_id": session_id,
    "verify_result": "fail",
    "segment_index": 1
})
print(f"\nadapt fail: {res.json()}")