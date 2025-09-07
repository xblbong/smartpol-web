#!/usr/bin/env python3
"""
Test script untuk validasi sistem autentikasi role-based
Memastikan hanya role yang diizinkan yang dapat login melalui endpoint standar
"""

import requests
import json
from datetime import datetime

# Configuration
BASE_URL = 'http://localhost:5000'
HEADERS = {'Content-Type': 'application/json'}

def print_test_header(test_name):
    print(f"\n{'='*50}")
    print(f"🧪 {test_name}")
    print(f"{'='*50}")

def print_result(success, message):
    icon = "✅" if success else "❌"
    print(f"{icon} {message}")

def test_server_connection():
    """Test koneksi ke server backend"""
    try:
        response = requests.get(f'{BASE_URL}/api/health', timeout=5)
        if response.status_code == 200:
            print_result(True, "Backend server terhubung")
            return True
        else:
            print_result(False, f"Server response: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print_result(False, f"Tidak dapat terhubung ke server: {e}")
        return False

def test_allowed_role_login(username, password, expected_role):
    """Test login dengan role yang diizinkan"""
    try:
        login_data = {
            'username': username,
            'password': password
        }
        
        response = requests.post(
            f'{BASE_URL}/api/login',
            headers=HEADERS,
            data=json.dumps(login_data)
        )
        
        if response.status_code == 200:
            data = response.json()
            user_role = data.get('user', {}).get('role')
            if user_role == expected_role:
                print_result(True, f"Login berhasil untuk role '{expected_role}' (user: {username})")
                return True
            else:
                print_result(False, f"Role tidak sesuai. Expected: {expected_role}, Got: {user_role}")
                return False
        else:
            error_msg = response.json().get('error', 'Unknown error')
            print_result(False, f"Login gagal untuk {username}: {error_msg}")
            return False
            
    except Exception as e:
        print_result(False, f"Error testing {username}: {e}")
        return False

def test_blocked_role_login(username, password, blocked_role):
    """Test login dengan role yang diblokir"""
    try:
        login_data = {
            'username': username,
            'password': password
        }
        
        response = requests.post(
            f'{BASE_URL}/api/login',
            headers=HEADERS,
            data=json.dumps(login_data)
        )
        
        if response.status_code == 403:
            error_msg = response.json().get('error', '')
            if 'Akses ditolak' in error_msg or 'Admin users must login' in error_msg:
                print_result(True, f"Role '{blocked_role}' berhasil diblokir (user: {username})")
                return True
            else:
                print_result(False, f"Error message tidak sesuai: {error_msg}")
                return False
        else:
            print_result(False, f"Login seharusnya diblokir untuk role '{blocked_role}' (user: {username})")
            return False
            
    except Exception as e:
        print_result(False, f"Error testing blocked role {username}: {e}")
        return False

def test_admin_portal_access():
    """Test akses admin melalui portal admin"""
    try:
        login_data = {
            'username': 'admin',
            'password': 'admin123'
        }
        
        response = requests.post(
            f'{BASE_URL}/api/admin/login',
            headers=HEADERS,
            data=json.dumps(login_data)
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('user', {}).get('role') == 'admin':
                print_result(True, "Admin dapat login melalui portal admin")
                return True
            else:
                print_result(False, "Admin login berhasil tapi role tidak sesuai")
                return False
        else:
            error_msg = response.json().get('error', 'Unknown error')
            print_result(False, f"Admin login gagal: {error_msg}")
            return False
            
    except Exception as e:
        print_result(False, f"Error testing admin portal: {e}")
        return False

def main():
    print(f"🚀 Memulai testing sistem autentikasi role-based...")
    print(f"📋 Waktu testing: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🌐 Server: {BASE_URL}")
    
    # Test koneksi server
    print_test_header("Test Koneksi Server")
    if not test_server_connection():
        print("\n❌ Server tidak dapat diakses. Pastikan backend berjalan di http://localhost:5000")
        return
    
    # Test role yang diizinkan
    print_test_header("Test Role yang Diizinkan")
    allowed_tests = [
        # Format: (username, password, expected_role)
        # Note: Anda perlu membuat user test dengan role ini terlebih dahulu
        ('test_konsituen', 'password123', 'konsituen'),
        ('test_dpri', 'password123', 'dpri'),
        ('test_dprd', 'password123', 'dprd'),
        ('test_pimpinan', 'password123', 'pimpinan_daerah'),
    ]
    
    allowed_success = 0
    for username, password, role in allowed_tests:
        if test_allowed_role_login(username, password, role):
            allowed_success += 1
    
    print(f"\n📊 Role yang diizinkan: {allowed_success}/{len(allowed_tests)} berhasil")
    
    # Test role yang diblokir
    print_test_header("Test Role yang Diblokir")
    blocked_tests = [
        # Format: (username, password, blocked_role)
        ('admin', 'admin123', 'admin'),
        ('test_moderator', 'password123', 'moderator'),
    ]
    
    blocked_success = 0
    for username, password, role in blocked_tests:
        if test_blocked_role_login(username, password, role):
            blocked_success += 1
    
    print(f"\n📊 Role yang diblokir: {blocked_success}/{len(blocked_tests)} berhasil")
    
    # Test admin portal
    print_test_header("Test Portal Admin")
    admin_success = test_admin_portal_access()
    
    # Summary
    print_test_header("Ringkasan Testing")
    total_tests = len(allowed_tests) + len(blocked_tests) + 1
    total_success = allowed_success + blocked_success + (1 if admin_success else 0)
    
    print(f"📈 Total test: {total_success}/{total_tests} berhasil")
    print(f"✅ Role diizinkan: {allowed_success}/{len(allowed_tests)}")
    print(f"🚫 Role diblokir: {blocked_success}/{len(blocked_tests)}")
    print(f"👑 Admin portal: {'✅' if admin_success else '❌'}")
    
    if total_success == total_tests:
        print("\n🎉 Semua test berhasil! Sistem autentikasi role-based berfungsi dengan baik.")
    else:
        print(f"\n⚠️  {total_tests - total_success} test gagal. Periksa konfigurasi sistem.")
    
    print("\n📝 Catatan:")
    print("   - Pastikan user test sudah dibuat dengan role yang sesuai")
    print("   - Periksa database untuk memastikan role user sudah benar")
    print("   - Verifikasi bahwa backend server berjalan dengan benar")

if __name__ == '__main__':
    main()