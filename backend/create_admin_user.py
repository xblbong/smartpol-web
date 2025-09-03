#!/usr/bin/env python3
"""
Script untuk membuat user admin di database SmartPol
"""

import sys
import os
from werkzeug.security import generate_password_hash
from datetime import datetime

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db, User

def create_admin_user():
    """Membuat user admin untuk testing"""
    
    with app.app_context():
        # Cek apakah admin sudah ada
        existing_admin = User.query.filter_by(username='admin').first()
        if existing_admin:
            print("❌ User admin sudah ada!")
            print(f"   Username: {existing_admin.username}")
            print(f"   Email: {existing_admin.email}")
            print(f"   Role: {existing_admin.role}")
            return
        
        # Data admin
        admin_data = {
            'username': 'admin',
            'full_name': 'Administrator SmartPol',
            'email': 'admin@smartpol.id',
            'password': 'admin123',  # Password default
            'role': 'admin',
            'description': 'Administrator sistem SmartPol untuk testing',
            'nik': '1234567890123456',  # NIK dummy untuk testing
            'nik_verified': True,
            'kecamatan': 'Klojen',
            'dapil': 'Dapil 1',
            'is_active': True
        }
        
        try:
            # Buat user admin
            admin_user = User(
                username=admin_data['username'],
                full_name=admin_data['full_name'],
                email=admin_data['email'],
                role=admin_data['role'],
                description=admin_data['description'],
                nik=admin_data['nik'],
                nik_verified=admin_data['nik_verified'],
                kecamatan=admin_data['kecamatan'],
                dapil=admin_data['dapil'],
                is_active=admin_data['is_active'],
                created_at=datetime.utcnow()
            )
            
            # Set password
            admin_user.set_password(admin_data['password'])
            
            # Simpan ke database
            db.session.add(admin_user)
            db.session.commit()
            
            print("✅ User admin berhasil dibuat!")
            print(f"   Username: {admin_data['username']}")
            print(f"   Email: {admin_data['email']}")
            print(f"   Password: {admin_data['password']}")
            print(f"   Role: {admin_data['role']}")
            print(f"   NIK: {admin_data['nik']} (Terverifikasi)")
            print("\n🔐 Silakan login dengan kredensial di atas untuk testing admin.")
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error membuat user admin: {str(e)}")
            return False
            
    return True

def create_test_users():
    """Membuat beberapa user test untuk keperluan testing"""
    
    with app.app_context():
        test_users = [
            {
                'username': 'user1',
                'full_name': 'Budi Santoso',
                'email': 'budi@example.com',
                'password': 'user123',
                'role': 'konsituen',
                'nik': '3573010101900001',
                'nik_verified': True,
                'kecamatan': 'Klojen',
                'dapil': 'Dapil 1'
            },
            {
                'username': 'user2',
                'full_name': 'Siti Aminah',
                'email': 'siti@example.com',
                'password': 'user123',
                'role': 'konsituen',
                'nik': '3573010201850002',
                'nik_verified': True,
                'kecamatan': 'Blimbing',
                'dapil': 'Dapil 2'
            },
            {
                'username': 'user3',
                'full_name': 'Ahmad Rahman',
                'email': 'ahmad@example.com',
                'password': 'user123',
                'role': 'konsituen',
                'nik': '3573010301920003',
                'nik_verified': False,
                'kecamatan': 'Sukun',
                'dapil': 'Dapil 3'
            }
        ]
        
        created_count = 0
        for user_data in test_users:
            # Cek apakah user sudah ada
            existing_user = User.query.filter_by(username=user_data['username']).first()
            if existing_user:
                print(f"⚠️  User {user_data['username']} sudah ada, dilewati.")
                continue
                
            try:
                # Buat user
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
                print(f"✅ User {user_data['username']} berhasil dibuat")
                
            except Exception as e:
                db.session.rollback()
                print(f"❌ Error membuat user {user_data['username']}: {str(e)}")
                
        if created_count > 0:
            print(f"\n✅ {created_count} user test berhasil dibuat!")
        else:
            print("\n⚠️  Tidak ada user test yang dibuat (mungkin sudah ada semua).")

if __name__ == '__main__':
    print("🚀 Membuat user admin dan user test...\n")
    
    # Buat admin user
    create_admin_user()
    
    print("\n" + "="*50 + "\n")
    
    # Buat test users
    create_test_users()
    
    print("\n🎉 Selesai! Database siap untuk testing.")