#!/usr/bin/env python3
"""
Script untuk membuat user test dengan berbagai role untuk testing autentikasi
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db, User
from datetime import datetime

def create_test_users_for_auth():
    """Membuat user test dengan role yang diperlukan untuk testing autentikasi"""
    
    with app.app_context():
        test_users = [
            # Role yang diizinkan
            {
                'username': 'test_konsituen',
                'full_name': 'Test Konsituen',
                'email': 'test_konsituen@example.com',
                'password': 'password123',
                'role': 'konsituen',
                'nik': '3573010101900001',
                'nik_verified': True,
                'kecamatan': 'Klojen',
                'dapil': 'Dapil 1'
            },
            {
                'username': 'test_dpri',
                'full_name': 'Test DPRI',
                'email': 'test_dpri@example.com',
                'password': 'password123',
                'role': 'dpri',
                'nik': '3573010201850002',
                'nik_verified': True,
                'kecamatan': 'Blimbing',
                'dapil': 'Dapil 2'
            },
            {
                'username': 'test_dprd',
                'full_name': 'Test DPRD',
                'email': 'test_dprd@example.com',
                'password': 'password123',
                'role': 'dprd',
                'nik': '3573010301920003',
                'nik_verified': True,
                'kecamatan': 'Sukun',
                'dapil': 'Dapil 3'
            },
            {
                'username': 'test_pimpinan',
                'full_name': 'Test Pimpinan Daerah',
                'email': 'test_pimpinan@example.com',
                'password': 'password123',
                'role': 'pimpinan_daerah',
                'nik': '3573010401880004',
                'nik_verified': True,
                'kecamatan': 'Kedungkandang',
                'dapil': 'Dapil 4'
            },
            # Role yang diblokir
            {
                'username': 'test_moderator',
                'full_name': 'Test Moderator',
                'email': 'test_moderator@example.com',
                'password': 'password123',
                'role': 'moderator',
                'nik': '3573010501750005',
                'nik_verified': True,
                'kecamatan': 'Lowokwaru',
                'dapil': 'Dapil 5'
            }
        ]
        
        created_count = 0
        updated_count = 0
        
        for user_data in test_users:
            # Cek apakah user sudah ada
            existing_user = User.query.filter_by(username=user_data['username']).first()
            
            if existing_user:
                # Update existing user
                try:
                    existing_user.full_name = user_data['full_name']
                    existing_user.email = user_data['email']
                    existing_user.role = user_data['role']
                    existing_user.nik = user_data['nik']
                    existing_user.nik_verified = user_data['nik_verified']
                    existing_user.kecamatan = user_data['kecamatan']
                    existing_user.dapil = user_data['dapil']
                    existing_user.is_active = True
                    existing_user.set_password(user_data['password'])
                    
                    db.session.commit()
                    updated_count += 1
                    print(f"✅ User {user_data['username']} berhasil diupdate (role: {user_data['role']})")
                    
                except Exception as e:
                    db.session.rollback()
                    print(f"❌ Error mengupdate user {user_data['username']}: {str(e)}")
            else:
                # Buat user baru
                try:
                    user = User(
                        username=user_data['username'],
                        full_name=user_data['full_name'],
                        email=user_data['email'],
                        role=user_data['role'],
                        nik=user_data['nik'],
                        nik_verified=user_data['nik_verified'],
                        kecamatan=user_data['kecamatan'],
                        dapil=user_data['dapil'],
                        is_active=True,
                        created_at=datetime.utcnow()
                    )
                    
                    # Set password
                    user.set_password(user_data['password'])
                    
                    # Simpan ke database
                    db.session.add(user)
                    db.session.commit()
                    
                    created_count += 1
                    print(f"✅ User {user_data['username']} berhasil dibuat (role: {user_data['role']})")
                    
                except Exception as e:
                    db.session.rollback()
                    print(f"❌ Error membuat user {user_data['username']}: {str(e)}")
        
        print(f"\n📊 Ringkasan:")
        print(f"   - User baru dibuat: {created_count}")
        print(f"   - User diupdate: {updated_count}")
        print(f"   - Total user test: {created_count + updated_count}")
        
        # Tampilkan daftar user test yang tersedia
        print(f"\n👥 User test yang tersedia untuk testing:")
        for user_data in test_users:
            print(f"   - {user_data['username']} (role: {user_data['role']}, password: {user_data['password']})")
        
        return True

def list_all_users():
    """Menampilkan semua user yang ada di database"""
    
    with app.app_context():
        users = User.query.all()
        
        print(f"\n👥 Semua user di database ({len(users)} total):")
        print(f"{'Username':<20} {'Role':<15} {'Email':<30} {'Active':<8}")
        print("-" * 75)
        
        for user in users:
            active_status = "✅" if user.is_active else "❌"
            print(f"{user.username:<20} {user.role:<15} {user.email:<30} {active_status:<8}")
        
        # Statistik role
        from collections import Counter
        role_stats = Counter([user.role for user in users])
        
        print(f"\n📊 Statistik role:")
        for role, count in role_stats.items():
            print(f"   - {role}: {count} user(s)")

if __name__ == '__main__':
    print("🚀 Membuat user test untuk testing autentikasi role-based...\n")
    
    # Buat user test
    create_test_users_for_auth()
    
    print("\n" + "="*50 + "\n")
    
    # Tampilkan semua user
    list_all_users()
    
    print("\n🎉 Selesai! User test siap untuk testing autentikasi.")
    print("\n💡 Gunakan kredensial di atas untuk testing sistem autentikasi role-based.")