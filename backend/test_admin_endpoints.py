#!/usr/bin/env python3
"""
Script untuk testing endpoint admin CRUD operations
Pastikan backend server berjalan di http://localhost:5000
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

def test_admin_login():
    """Test admin login"""
    print("\n=== Testing Admin Login ===")
    
    login_data = {
        "username": "admin",
        "password": "admin123"
    }
    
    try:
        response = session.post(f"{BASE_URL}/admin/login", json=login_data)
        
        if response.status_code == 200:
            print("✅ Admin login berhasil")
            return True
        else:
            print(f"❌ Admin login gagal: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error saat login: {e}")
        return False

def test_user_management_crud():
    """Test User Management CRUD operations"""
    print("\n=== Testing User Management CRUD ===")
    
    # Test GET all users
    try:
        response = session.get(f"{BASE_URL}/admin/users")
        if response.status_code == 200:
            print("✅ GET all users berhasil")
            users_data = response.json()
            print(f"   Total users: {len(users_data)}")
        else:
            print(f"❌ GET all users gagal: {response.status_code}")
    except Exception as e:
        print(f"❌ Error GET users: {e}")
    
    # Test CREATE user
    new_user = {
        "username": f"testuser_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
        "email": f"test_{datetime.now().strftime('%Y%m%d_%H%M%S')}@example.com",
        "password": "testpass123",
        "full_name": "Test User",
        "role": "user"
    }
    
    try:
        response = session.post(f"{BASE_URL}/admin/users", json=new_user)
        
        if response.status_code == 201:
            print("✅ CREATE user berhasil")
            created_user = response.json()
            user_id = created_user['user']['id']
            
            # Test UPDATE user
            update_data = {
                "full_name": "Updated Test User",
                "role": "moderator"
            }
            
            response = session.put(f"{BASE_URL}/admin/users/{user_id}", json=update_data)
            
            if response.status_code == 200:
                print("✅ UPDATE user berhasil")
            else:
                print(f"❌ UPDATE user gagal: {response.status_code}")
            
            # Test DELETE user
            response = session.delete(f"{BASE_URL}/admin/users/{user_id}")
            
            if response.status_code == 200:
                print("✅ DELETE user berhasil")
            else:
                print(f"❌ DELETE user gagal: {response.status_code}")
                
        else:
            print(f"❌ CREATE user gagal: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Error CRUD users: {e}")

def test_analytics_endpoints():
    """Test Analytics endpoints"""
    print("\n=== Testing Analytics Endpoints ===")
    
    endpoints = [
        "/admin/analytics/overview",
        "/admin/analytics/users",
        "/admin/analytics/polls",
        "/admin/analytics/chatbot",
        "/admin/dashboard/quick-stats"
    ]
    
    for endpoint in endpoints:
        try:
            response = session.get(f"{BASE_URL}{endpoint}")
            if response.status_code == 200:
                print(f"✅ {endpoint} berhasil")
            else:
                print(f"❌ {endpoint} gagal: {response.status_code}")
        except Exception as e:
            print(f"❌ Error {endpoint}: {e}")

def test_reports_endpoints():
    """Test Reports endpoints"""
    print("\n=== Testing Reports Endpoints ===")
    
    endpoints = [
        "/admin/reports/daily",
        "/admin/reports/monthly",
        "/admin/reports/annual",
        "/admin/reports/chatbot",
        "/admin/reports/polling"
    ]
    
    for endpoint in endpoints:
        try:
            response = session.get(f"{BASE_URL}{endpoint}")
            if response.status_code == 200:
                print(f"✅ {endpoint} berhasil")
            else:
                print(f"❌ {endpoint} gagal: {response.status_code}")
        except Exception as e:
            print(f"❌ Error {endpoint}: {e}")

def test_policies_management():
    """Test Policies Management endpoints"""
    print("\n=== Testing Policies Management ===")
    
    # Test GET policies
    try:
        response = session.get(f"{BASE_URL}/admin/policies")
        if response.status_code == 200:
            print("✅ GET policies berhasil")
        else:
            print(f"❌ GET policies gagal: {response.status_code}")
    except Exception as e:
        print(f"❌ Error GET policies: {e}")
    
    # Test GET policies stats
    try:
        response = session.get(f"{BASE_URL}/admin/policies/stats")
        if response.status_code == 200:
            print("✅ GET policies stats berhasil")
        else:
            print(f"❌ GET policies stats gagal: {response.status_code}")
    except Exception as e:
        print(f"❌ Error GET policies stats: {e}")

def test_polling_management():
    """Test Polling Management endpoints"""
    print("\n=== Testing Polling Management ===")
    
    try:
        # Test GET polls
        response = session.get(f"{BASE_URL}/admin/polls")
        if response.status_code == 200:
            print("✅ GET polls berhasil")
            polls_data = response.json()
            
            # Test poll results if polls exist
            if polls_data.get('polls') and len(polls_data['polls']) > 0:
                poll_id = polls_data['polls'][0]['id']
                response = session.get(f"{BASE_URL}/admin/polls/{poll_id}/results")
                if response.status_code == 200:
                    print("✅ GET poll results berhasil")
                else:
                    print(f"❌ GET poll results gagal: {response.status_code}")
        else:
            print(f"❌ GET polls gagal: {response.status_code}")
        
        # Test GET polls stats
        response = session.get(f"{BASE_URL}/admin/polls/stats")
        if response.status_code == 200:
            print("✅ GET polls stats berhasil")
        else:
            print(f"❌ GET polls stats gagal: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error polling management: {e}")

def test_user_stats():
    """Test User Statistics endpoint"""
    print("\n=== Testing User Statistics ===")
    
    try:
        response = session.get(f"{BASE_URL}/admin/users/stats")
        if response.status_code == 200:
            print("✅ GET user stats berhasil")
            stats = response.json()
            print(f"   Total users: {stats.get('total_users', 0)}")
            print(f"   Active users: {stats.get('active_users', 0)}")
        else:
            print(f"❌ GET user stats gagal: {response.status_code}")
    except Exception as e:
        print(f"❌ Error user stats: {e}")

def main():
    """Main testing function"""
    print("🚀 Memulai testing endpoint admin CRUD...")
    print("📋 Pastikan backend server berjalan di http://localhost:5000")
    
    # Test basic connectivity
    try:
        response = session.get(f"{BASE_URL}/health")
        if response.status_code == 200:
            print("✅ Backend server terhubung")
        else:
            print("❌ Backend server tidak merespons dengan benar")
            return
    except Exception as e:
        print(f"❌ Tidak dapat terhubung ke backend server: {e}")
        print("   Pastikan server berjalan dengan: python app.py")
        return
    
    # Run all tests
    test_admin_login()
    test_user_management_crud()
    test_analytics_endpoints()
    test_reports_endpoints()
    test_policies_management()
    test_polling_management()
    test_user_stats()
    
    print("\n🎉 Testing selesai!")
    print("📊 Periksa hasil di atas untuk memastikan semua endpoint berfungsi")

if __name__ == "__main__":
    main()