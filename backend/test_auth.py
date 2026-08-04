import requests
import sys

BASE_URL = "http://127.0.0.1:8000/api/v1/auth"
TEST_EMAIL = "vasundhrathanga20@gmail.com"
TEST_PASSWORD = "password123"
TEST_NAME = "Vasundhra"

def test_flow():
    print("1. Testing Registration...")
    reg_payload = {
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD,
        "full_name": TEST_NAME
    }
    
    # Try registering. If user exists, it's fine, we will proceed to login.
    res = requests.post(f"{BASE_URL}/register", json=reg_payload)
    if res.status_code == 200:
        print("   ✅ Registration successful:", res.json())
    elif res.status_code == 400 and "already exists" in res.json().get("detail", ""):
        print("   ℹ️ User already exists (which is fine for this test).")
    else:
        print("   ❌ Registration failed:", res.status_code, res.text)
        sys.exit(1)

    print("\n2. Testing Login (using x-www-form-urlencoded as expected by OAuth2 password flow)...")
    login_data = {
        "username": TEST_EMAIL,
        "password": TEST_PASSWORD
    }
    
    res = requests.post(f"{BASE_URL}/login", data=login_data)
    if res.status_code == 200:
        token_data = res.json()
        print("   ✅ Login successful! Token received:")
        print("   ", token_data)
        access_token = token_data.get("access_token")
    else:
        print("   ❌ Login failed:", res.status_code, res.text)
        sys.exit(1)

    print("\n3. Testing Auth Me Info (using Bearer access token)...")
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    res = requests.get(f"{BASE_URL}/me", headers=headers)
    if res.status_code == 200:
        print("   ✅ Fetch /me successful:", res.json())
    else:
        print("   ❌ Fetch /me failed:", res.status_code, res.text)
        sys.exit(1)
        
    print("\n🎉 All auth tests passed successfully!")

if __name__ == "__main__":
    test_flow()
