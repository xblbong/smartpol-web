#!/usr/bin/env python3
"""
Script untuk testing admin logout functionality
"""

import requests
import json
from datetime import datetime

# Base URL untuk API
BASE_URL = "http://localhost:5000/api"

# Headers untuk request
headers = {
    'Content-Type': 'application/json'
}

# Session untuk menyimpan cookies
session = requests.Session()
session.headers.update(headers)

def test_admin_login_logout_flow():
    """Test complete admin login and logout flow"""
    print("=== Testing Admin Login & Logout Flow ===")
    
    # Step 1: Test admin login
    print("\n1. Testing Admin Login...")
    login_data = {
        "username": "admin",
        "password": "admin123"
    }
    
    try:
        response = session.post(f"{BASE_URL}/admin/login", json=login_data)
        
        if response.status_code == 200:
            print("✅ Admin login berhasil")
            login_result = response.json()
            print(f"   User: {login_result['user']['username']}")
            print(f"   Role: {login_result['user']['role']}")
            print(f"   Token: {login_result.get('token', 'N/A')}")
        else:
            print(f"❌ Admin login gagal: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error saat admin login: {e}")
        return False
    
    # Step 2: Test accessing protected admin endpoint
    print("\n2. Testing Access to Protected Admin Endpoint...")
    try:
        response = session.get(f"{BASE_URL}/admin/dashboard/quick-stats")
        
        if response.status_code == 200:
            print("✅ Akses ke endpoint admin berhasil")
            stats = response.json()
            print(f"   Total Users: {stats.get('total', {}).get('users', 0)}")
            print(f"   Active Polls: {stats.get('active', {}).get('polls', 0)}")
        else:
            print(f"❌ Akses ke endpoint admin gagal: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error mengakses endpoint admin: {e}")
    
    # Step 3: Test admin logout
    print("\n3. Testing Admin Logout...")
    try:
        response = session.post(f"{BASE_URL}/logout")
        
        if response.status_code == 200:
            print("✅ Admin logout berhasil")
            logout_result = response.json()
            print(f"   Message: {logout_result.get('message', 'N/A')}")
        else:
            print(f"❌ Admin logout gagal: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error saat admin logout: {e}")
        return False
    
    # Step 4: Test accessing protected endpoint after logout
    print("\n4. Testing Access After Logout (Should Fail)...")
    try:
        response = session.get(f"{BASE_URL}/admin/dashboard/quick-stats")
        
        if response.status_code == 401:
            print("✅ Akses ditolak setelah logout (sesuai harapan)")
        elif response.status_code == 200:
            print("⚠️  WARNING: Masih bisa akses endpoint setelah logout!")
            print("   Ini menunjukkan ada masalah dengan session management")
        else:
            print(f"❓ Response tidak terduga: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error testing akses setelah logout: {e}")
    
    return True

def test_session_management():
    """Test session management details"""
    print("\n=== Testing Session Management Details ===")
    
    # Login again for testing
    login_data = {
        "username": "admin",
        "password": "admin123"
    }
    
    try:
        # Fresh session for this test
        test_session = requests.Session()
        test_session.headers.update(headers)
        
        # Login
        response = test_session.post(f"{BASE_URL}/admin/login", json=login_data)
        if response.status_code != 200:
            print("❌ Tidak bisa login untuk test session")
            return
        
        print("✅ Login berhasil untuk test session")
        
        # Check cookies
        print(f"\n🍪 Session Cookies: {len(test_session.cookies)} cookies")
        for cookie in test_session.cookies:
            print(f"   - {cookie.name}: {cookie.value[:20]}...")
        
        # Test logout and check cookies cleared
        response = test_session.post(f"{BASE_URL}/logout")
        if response.status_code == 200:
            print("\n✅ Logout berhasil")
            print(f"🍪 Cookies after logout: {len(test_session.cookies)} cookies")
            
            # Check if session is really cleared
            response = test_session.get(f"{BASE_URL}/admin/users")
            if response.status_code == 401:
                print("✅ Session benar-benar dibersihkan")
            else:
                print("⚠️  WARNING: Session mungkin tidak dibersihkan dengan benar")
        
    except Exception as e:
        print(f"❌ Error testing session management: {e}")

if __name__ == "__main__":
    print("🔐 Testing Admin Logout Functionality...")
    print("📋 Pastikan backend server berjalan di http://localhost:5000")
    
    # Test basic connectivity
    try:
        response = requests.get(f"{BASE_URL}/health", headers=headers)
        if response.status_code == 200:
            print("✅ Backend server terhubung")
        else:
            print("❌ Backend server tidak merespons dengan benar")
            exit(1)
    except Exception as e:
        print(f"❌ Tidak dapat terhubung ke backend server: {e}")
        print("   Pastikan server berjalan dengan: python app.py")
        exit(1)
    
    # Run tests
    test_admin_login_logout_flow()
    test_session_management()
    
    print("\n🎯 Testing admin logout selesai!")
    print("📊 Periksa hasil di atas untuk memastikan logout berfungsi dengan aman")