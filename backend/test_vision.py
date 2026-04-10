import base64
import requests

BASE_URL = "http://localhost:8000/api"

# 1. Lấy session_id
start_res = requests.post(f"{BASE_URL}/story/start", json={"story_id": "forest"})
session_id = start_res.json()["session_id"]
print(f"session_id: {session_id}")

# 2. Đọc ảnh
with open("test_image.jpg", "rb") as f:
    image_b64 = "data:image/jpeg;base64," + base64.b64encode(f.read()).decode("utf-8")

# 3. Test magic_sign_check
res = requests.post(f"{BASE_URL}/vision/verify", json={
    "session_id": session_id,
    "image_base64": image_b64,
    "expected_action": "raise_hands",
    "context": "magic_sign_check"
})
print(f"magic_sign_check: {res.json()}")

# 4. Test challenge_verify
res = requests.post(f"{BASE_URL}/vision/verify", json={
    "session_id": session_id,
    "image_base64": image_b64,
    "expected_action": "raise_hands",
    "context": "challenge_verify"
})
print(f"challenge_verify: {res.json()}")