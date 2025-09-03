#!/usr/bin/env python3
"""
Script untuk mengupdate data officials dengan role, username, email, dan password
"""

import sys
import os
from datetime import datetime

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db, Officials

def update_officials_data():
    """Update data officials dengan field baru"""
    
    with app.app_context():
        # Ambil semua officials
        officials = Officials.query.all()
        
        if not officials:
            print("❌ Tidak ada data officials ditemukan!")
            return False
            
        print(f"📋 Ditemukan {len(officials)} officials untuk diupdate...\n")
        
        updated_count = 0
        for official in officials:
            try:
                # Tentukan role berdasarkan position
                if 'walikota' in official.position.lower() or 'wakil walikota' in official.position.lower():
                    role = 'pimpinan_daerah'
                elif 'dpri' in official.position.lower() or 'dpr ri' in official.position.lower():
                    role = 'dpri'
                else:
                    role = 'dprd'  # default untuk anggota DPRD
                
                # Generate username dari nama (lowercase, replace spaces with underscore)
                username = official.name.lower().replace(' ', '_').replace('.', '').replace(',', '')
                
                # Generate email
                email = f"{username}@smartpol.id"
                
                # Update data
                official.role = role
                official.username = username
                official.email = email
                official.is_active = True
                official.set_password('password123')  # Set password default
                official.updated_at = datetime.now()
                
                updated_count += 1
                print(f"✅ Updated: {official.name}")
                print(f"   Role: {role}")
                print(f"   Username: {username}")
                print(f"   Email: {email}")
                print(f"   Password: password123")
                print()
                
            except Exception as e:
                print(f"❌ Error updating {official.name}: {str(e)}")
                continue
                
        try:
            db.session.commit()
            print(f"\n🎉 Berhasil mengupdate {updated_count} officials!")
            print("\n📝 Semua officials sekarang memiliki:")
            print("   - Role (dprd/dpri/pimpinan_daerah)")
            print("   - Username (berdasarkan nama)")
            print("   - Email (@smartpol.id)")
            print("   - Password: password123")
            print("\n🔐 Officials sekarang bisa login ke sistem!")
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error menyimpan perubahan: {str(e)}")
            return False
            
        return True

def create_sample_officials():
    """Membuat beberapa officials sample jika belum ada"""
    
    with app.app_context():
        # Cek apakah sudah ada officials
        existing_officials = Officials.query.count()
        if existing_officials > 0:
            print(f"⚠️  Sudah ada {existing_officials} officials di database.")
            return
            
        # Data officials sample
        sample_officials = [
            {
                'name': 'Dr. H. Sutiaji, S.H., M.Hum.',
                'position': 'Walikota Malang',
                'party': 'Independen',
                'electoral_district': 'Kota Malang',
                'role': 'pimpinan_daerah'
            },
            {
                'name': 'H. Sofyan Edi Jarwoko, S.Sos., M.Si.',
                'position': 'Wakil Walikota Malang',
                'party': 'Independen',
                'electoral_district': 'Kota Malang',
                'role': 'pimpinan_daerah'
            },
            {
                'name': 'H. Ahmad Fuad, S.E., M.M.',
                'position': 'Ketua DPRD Kota Malang',
                'party': 'PDI-P',
                'electoral_district': 'Dapil 1',
                'role': 'dprd'
            },
            {
                'name': 'Hj. Siti Munawaroh, S.Pd.',
                'position': 'Anggota DPRD Kota Malang',
                'party': 'PKB',
                'electoral_district': 'Dapil 2',
                'role': 'dprd'
            },
            {
                'name': 'Drs. H. Bambang Priyo Utomo, M.Si.',
                'position': 'Anggota DPRD Kota Malang',
                'party': 'Golkar',
                'electoral_district': 'Dapil 3',
                'role': 'dprd'
            },
            {
                'name': 'H. Mohammad Nasir, S.H.',
                'position': 'Anggota DPR RI Dapil Jawa Timur VIII',
                'party': 'PKS',
                'electoral_district': 'Jawa Timur VIII',
                'role': 'dpri'
            }
        ]
        
        created_count = 0
        for official_data in sample_officials:
            try:
                # Generate username dan email
                username = official_data['name'].lower().replace(' ', '_').replace('.', '').replace(',', '').replace('h_', '').replace('hj_', '')
                email = f"{username}@smartpol.id"
                
                # Buat official
                official = Officials(
                    name=official_data['name'],
                    position=official_data['position'],
                    party=official_data['party'],
                    electoral_district=official_data['electoral_district'],
                    role=official_data['role'],
                    username=username,
                    email=email,
                    is_active=True,
                    created_at=datetime.now(),
                    updated_at=datetime.now()
                )
                
                # Set password
                official.set_password('password123')
                
                db.session.add(official)
                created_count += 1
                
                print(f"✅ Created: {official_data['name']}")
                print(f"   Role: {official_data['role']}")
                print(f"   Username: {username}")
                print(f"   Email: {email}")
                print()
                
            except Exception as e:
                print(f"❌ Error creating {official_data['name']}: {str(e)}")
                continue
                
        try:
            db.session.commit()
            print(f"\n🎉 Berhasil membuat {created_count} officials sample!")
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error menyimpan officials: {str(e)}")

if __name__ == '__main__':
    print("🚀 Mengupdate data officials...\n")
    
    # Buat sample officials jika belum ada
    create_sample_officials()
    
    print("\n" + "="*50 + "\n")
    
    # Update existing officials
    update_officials_data()
    
    print("\n🎉 Selesai! Officials siap untuk login.")