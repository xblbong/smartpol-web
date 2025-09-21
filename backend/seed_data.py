#!/usr/bin/env python3
"""
Script terpusat untuk seeding data ke database SmartPol
Mengkonsolidasi semua data seed dari berbagai file menjadi satu file
"""

import sys
import os
import json
from datetime import datetime, timedelta, date

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db, User, Dapil, Officials, Polling, PollingOption, Policy, EventPendidikanPolitik

def create_admin_user():
    """Membuat user admin default"""
    with app.app_context():
        # Check if admin already exists
        existing_admin = User.query.filter_by(username='admin').first()
        if existing_admin:
            print("✅ Admin user already exists")
            return existing_admin
        
        # Create admin user
        admin = User(
            username='admin',
            full_name='Administrator SmartPol',
            email='admin@smartpol.id',
            role='admin',
            description='System Administrator',
            nik='3573010101900001',
            nik_verified=True,
            kecamatan='Klojen',
            dapil='JAWA TIMUR VI',
            is_active=True
        )
        admin.set_password('admin123')
        
        db.session.add(admin)
        db.session.commit()
        print("✅ Admin user created successfully")
        return admin

def seed_dapil_data():
    """Insert Dapil data untuk berbagai wilayah"""
    with app.app_context():
        dapil_data = [
            {
                "name": "JAWA TIMUR VI",
                "description": "Daerah Pemilihan Jawa Timur VI meliputi Kota Malang, Kabupaten Malang, dan Kota Batu dengan 12 kursi DPR RI",
                "province": "Jawa Timur",
                "cities": ["Kota Malang", "Kabupaten Malang", "Kota Batu"],
                "kecamatan_list": [
                    # Kota Malang (5 kecamatan)
                    "Blimbing", "Kedungkandang", "Klojen", "Lowokwaru", "Sukun",
                    # Kabupaten Malang (33 kecamatan)
                    "Ampelgading", "Bantur", "Bululawang", "Dampit", "Dau", "Donomulyo", "Gedangan", "Gondanglegi",
                    "Jabung", "Kalipare", "Karangploso", "Kasembon", "Kepanjen", "Kromengan", "Lawang", "Ngajum",
                    "Ngantang", "Pagak", "Pagelaran", "Pakis", "Pakisaji", "Poncokusumo", "Pujon", "Singosari",
                    "Sumbermanjing Wetan", "Sumberpucung", "Tajinan", "Tirtoyudo", "Tumpang", "Turen", "Wagir", "Wajak", "Wonosari",
                    # Kota Batu (3 kecamatan)
                    "Batu", "Bumiaji", "Junrejo"
                ],
                "nik_prefixes": [
                    # Kota Malang (3573xx)
                    "357301", "357302", "357303", "357304", "357305",
                    # Kabupaten Malang (3507xx)
                    "350701", "350702", "350703", "350704", "350705", "350706", "350707", "350708", "350709", "350710",
                    "350711", "350712", "350713", "350714", "350715", "350716", "350717", "350718", "350719", "350720",
                    "350721", "350722", "350723", "350724", "350725", "350726", "350727", "350728", "350729", "350730",
                    "350731", "350732", "350733",
                    # Kota Batu (3579xx)
                    "357901", "357902", "357903"
                ]
            },
            {
                "name": "JAWA TIMUR I",
                "description": "Surabaya, Sidoarjo, Gresik",
                "province": "Jawa Timur",
                "cities": ["Kota Surabaya", "Kabupaten Sidoarjo", "Kabupaten Gresik"],
                "kecamatan_list": [
                    # Surabaya (beberapa kecamatan)
                    "Gubeng", "Sukolilo", "Rungkut", "Tenggilis Mejoyo", "Mulyorejo",
                    # Sidoarjo (beberapa kecamatan)
                    "Sidoarjo", "Gedangan", "Taman", "Waru", "Buduran",
                    # Gresik (beberapa kecamatan)
                    "Gresik", "Kebomas", "Manyar", "Duduksampeyan"
                ],
                "nik_prefixes": [
                    "357801", "357802", "357803", "357804", "357805",  # Surabaya (Gubeng, Sukolilo, Rungkut, Tenggilis Mejoyo, Mulyorejo)
                    "351501", "351502", "351503", "351504", "351505",  # Sidoarjo (Sidoarjo, Gedangan, Taman, Waru, Buduran)
                    "352501", "352502", "352503", "352504"  # Gresik (Gresik, Kebomas, Manyar, Duduksampeyan)
                ]
            },
            # DPRD Kota Malang - 5 Dapil berdasarkan kecamatan
            {
                "name": "KOTA MALANG DAPIL 1",
                "description": "Daerah Pemilihan DPRD Kota Malang 1 - Kecamatan Klojen dengan 5 kursi",
                "province": "Jawa Timur",
                "cities": ["Kota Malang"],
                "kecamatan_list": ["Klojen"],
                "nik_prefixes": ["357301"]
            },
            {
                "name": "KOTA MALANG DAPIL 2",
                "description": "Daerah Pemilihan DPRD Kota Malang 2 - Kecamatan Blimbing dengan 10 kursi",
                "province": "Jawa Timur",
                "cities": ["Kota Malang"],
                "kecamatan_list": ["Blimbing"],
                "nik_prefixes": ["357302"]
            },
            {
                "name": "KOTA MALANG DAPIL 3",
                "description": "Daerah Pemilihan DPRD Kota Malang 3 - Kecamatan Kedungkandang dengan 11 kursi",
                "province": "Jawa Timur",
                "cities": ["Kota Malang"],
                "kecamatan_list": ["Kedungkandang"],
                "nik_prefixes": ["357303"]
            },
            {
                "name": "KOTA MALANG DAPIL 4",
                "description": "Daerah Pemilihan DPRD Kota Malang 4 - Kecamatan Sukun dengan 10 kursi",
                "province": "Jawa Timur",
                "cities": ["Kota Malang"],
                "kecamatan_list": ["Sukun"],
                "nik_prefixes": ["357304"]
            },
            {
                "name": "KOTA MALANG DAPIL 5",
                "description": "Daerah Pemilihan DPRD Kota Malang 5 - Kecamatan Lowokwaru dengan 9 kursi",
                "province": "Jawa Timur",
                "cities": ["Kota Malang"],
                "kecamatan_list": ["Lowokwaru"],
                "nik_prefixes": ["357305"]
            }
        ]
        
        for data in dapil_data:
            existing_dapil = Dapil.query.filter_by(name=data["name"]).first()
            if existing_dapil:
                print(f"✅ Dapil {data['name']} already exists")
                continue
            
            dapil = Dapil(
                name=data["name"],
                description=data["description"],
                province=data["province"],
                cities=json.dumps(data["cities"]),
                kecamatan_list=json.dumps(data["kecamatan_list"]),
                nik_prefixes=json.dumps(data["nik_prefixes"])  # Tambahan untuk verifikasi NIK
            )
            
            db.session.add(dapil)
            print(f"✅ Dapil {data['name']} created")
        
        db.session.commit()
        print("✅ All Dapil data seeded successfully")

def seed_officials_data():
    """Insert officials data untuk berbagai dapil"""
    with app.app_context():
        officials_data = [
            # Pimpinan Daerah Jawa Timur
            {
                "name": "Khofifah Indar Parawansa",
                "position": "Gubernur Jawa Timur",
                "party": "PKB",
                "role": "pimpinan_daerah",
                "electoral_district": "Jawa Timur",
                "period_start": date(2019, 2, 13),
                "period_end": date(2024, 2, 13),
                "status_smartpol": True,
                "bio": "Gubernur Jawa Timur periode 2019-2024. Sebelumnya menjabat sebagai Menteri Sosial RI (2014-2018). Aktif dalam organisasi kemasyarakatan dan pemberdayaan perempuan.",
                "education": "S2 Administrasi Publik Universitas Airlangga, S1 Psikologi Universitas Airlangga",
                "birth_date": date(1965, 9, 15),
                "birth_place": "Surabaya"
            },
            {
                "name": "Emil Elestianto Dardak",
                "position": "Wakil Gubernur Jawa Timur",
                "party": "PKB",
                "role": "pimpinan_daerah",
                "electoral_district": "Jawa Timur",
                "period_start": date(2019, 2, 13),
                "period_end": date(2024, 2, 13),
                "status_smartpol": False,
                "bio": "Wakil Gubernur Jawa Timur periode 2019-2024. Sebelumnya menjabat sebagai Bupati Trenggalek (2016-2018). Fokus pada pembangunan infrastruktur dan ekonomi digital.",
                "education": "S2 Teknik Sipil Institut Teknologi Sepuluh Nopember (ITS), S1 Teknik Sipil ITS",
                "birth_date": date(1984, 4, 24),
                "birth_place": "Trenggalek"
            },
            # Walikota dan Wakil Walikota Malang Periode 2018-2023
            {
                "name": "Drs. H. Sutiaji",
                "position": "Walikota Malang",
                "party": "Independen",
                "role": "pimpinan_daerah",
                "electoral_district": "Kota Malang",
                "period_start": date(2018, 2, 26),
                "period_end": date(2023, 2, 26),
                "status_smartpol": True,
                "bio": "Walikota Malang periode 2018-2023. Sebelumnya menjabat sebagai Wakil Walikota Malang (2013-2018). Fokus pada smart city, digitalisasi pelayanan publik, dan pengembangan pariwisata.",
                "education": "S1 Administrasi Negara Universitas Brawijaya",
                "birth_date": date(1962, 8, 17),
                "birth_place": "Malang"
            },
            {
                "name": "Ir. H. Sofyan Edi Jarwoko",
                "position": "Wakil Walikota Malang",
                "party": "Independen",
                "role": "pimpinan_daerah",
                "electoral_district": "Kota Malang",
                "period_start": date(2018, 2, 26),
                "period_end": date(2023, 2, 26),
                "status_smartpol": False,
                "bio": "Wakil Walikota Malang periode 2018-2023. Sebelumnya menjabat sebagai Kepala Dinas PU Kota Malang. Fokus pada infrastruktur dan tata kota.",
                "education": "S1 Teknik Sipil Universitas Brawijaya",
                "birth_date": date(1960, 3, 12),
                "birth_place": "Malang"
            },
            # DPR RI dari Jatim VI (Data Aktual)
            {
                "name": "Dr. Gamal Albinsaid",
                "position": "Anggota DPR RI",
                "party": "PKS",
                "role": "dpri",
                "electoral_district": "JAWA TIMUR VI",
                "period_start": date(2019, 10, 1),
                "period_end": date(2024, 9, 30),
                "status_smartpol": True,
                "commission": "Komisi X",
                "commission_focus": "Pendidikan, Kebudayaan, Riset dan Teknologi, Pariwisata, Ekonomi Kreatif, Pemuda, Olahraga, dan Perpustakaan",
                "bio": "Anggota DPR RI dari Dapil Jatim VI. Dokter dan aktivis sosial, pendiri Malang Corruption Watch (MCW). Lahir di Malang, 8 September 1989.",
                "education": "S1 dan S2 Fakultas Kedokteran Universitas Brawijaya",
                "birth_date": date(1989, 9, 8),
                "birth_place": "Malang"
            },
            {
                "name": "Dr. Ahmad Basarah",
                "position": "Anggota DPR RI",
                "party": "PDI-P",
                "role": "dpri",
                "electoral_district": "JAWA TIMUR VI",
                "period_start": date(2019, 10, 1),
                "period_end": date(2024, 9, 30),
                "status_smartpol": False,
                "commission": "Komisi II",
                "commission_focus": "Pemerintahan Dalam Negeri, Otonomi Daerah, Aparatur Negara, Agraria dan Pertanahan",
                "bio": "Anggota DPR RI dari Dapil Jatim VI. Sekretaris Jenderal PDI Perjuangan. Aktif dalam bidang politik dan pemerintahan.",
                "education": "S3 Ilmu Politik Universitas Airlangga, S2 Ilmu Politik Universitas Airlangga",
                "birth_date": date(1971, 8, 15),
                "birth_place": "Malang"
            },
            {
                "name": "Ir. Andreas Eddy Susetyo",
                "position": "Anggota DPR RI",
                "party": "PDI-P",
                "role": "dpri",
                "electoral_district": "JAWA TIMUR VI",
                "period_start": date(2019, 10, 1),
                "period_end": date(2024, 9, 30),
                "status_smartpol": False,
                "commission": "Komisi VII",
                "commission_focus": "Energi, Sumber Daya Mineral, Riset dan Teknologi, Lingkungan Hidup",
                "bio": "Anggota DPR RI dari Dapil Jatim VI. Berpengalaman dalam bidang teknik dan energi.",
                "education": "S1 Teknik Elektro Institut Teknologi Sepuluh Nopember (ITS)",
                "birth_date": date(1965, 5, 20),
                "birth_place": "Surabaya"
            },
            # DPRD Kota Malang (Data Aktual)
            {
                "name": "H. Moch. Arief Wicaksono",
                "position": "Ketua DPRD Kota Malang",
                "party": "PDI-P",
                "role": "dprd",
                "electoral_district": "Kota Malang",
                "period_start": date(2019, 8, 23),
                "period_end": date(2024, 8, 23),
                "status_smartpol": True,
                "commission": "Pimpinan DPRD",
                "commission_focus": "Koordinasi dan Pengawasan Legislatif",
                "bio": "Ketua DPRD Kota Malang periode 2019-2024. Berpengalaman dalam bidang legislatif dan pemerintahan daerah.",
                "education": "S1 Ilmu Pemerintahan Universitas Brawijaya",
                "birth_date": date(1970, 3, 15),
                "birth_place": "Malang"
            },
            {
                "name": "H. Didik Gatot Subroto",
                "position": "Wakil Ketua DPRD Kota Malang",
                "party": "Golkar",
                "role": "dprd",
                "electoral_district": "Kota Malang",
                "period_start": date(2019, 8, 23),
                "period_end": date(2024, 8, 23),
                "status_smartpol": False,
                "commission": "Pimpinan DPRD",
                "commission_focus": "Koordinasi dan Pengawasan Legislatif",
                "bio": "Wakil Ketua DPRD Kota Malang periode 2019-2024. Aktif dalam pembangunan ekonomi dan infrastruktur.",
                "education": "S1 Ekonomi Universitas Brawijaya",
                "birth_date": date(1968, 12, 8),
                "birth_place": "Malang"
            },
            {
                "name": "Hj. Yenny Wahyuni",
                "position": "Wakil Ketua DPRD Kota Malang",
                "party": "PKB",
                "role": "dprd",
                "electoral_district": "Kota Malang",
                "period_start": date(2019, 8, 23),
                "period_end": date(2024, 8, 23),
                "status_smartpol": False,
                "commission": "Pimpinan DPRD",
                "commission_focus": "Koordinasi dan Pengawasan Legislatif",
                "bio": "Wakil Ketua DPRD Kota Malang periode 2019-2024. Fokus pada pemberdayaan perempuan dan kesejahteraan sosial.",
                "education": "S1 Ilmu Sosial dan Politik Universitas Brawijaya",
                "birth_date": date(1972, 6, 10),
                "birth_place": "Malang"
            }
        ]
        
        for data in officials_data:
            existing_official = Officials.query.filter_by(name=data["name"]).first()
            if existing_official:
                print(f"✅ Official {data['name']} already exists")
                continue
            
            # Generate username dan email
            username = data["name"].lower().replace(' ', '_').replace('.', '').replace(',', '')
            email = f"{username}@smartpol.id"
            
            official = Officials(
                name=data["name"],
                position=data["position"],
                party=data["party"],
                role=data["role"],
                electoral_district=data["electoral_district"],
                period_start=data.get("period_start"),
                period_end=data.get("period_end"),
                status_smartpol=data["status_smartpol"],
                bio=data.get("bio"),
                education=data.get("education"),
                commission=data.get("commission"),
                commission_focus=data.get("commission_focus"),
                username=username,
                email=email,
                is_active=True
            )
            official.set_password('password123')  # Default password
            
            db.session.add(official)
            print(f"✅ Official {data['name']} created")
        
        db.session.commit()
        print("✅ All Officials data seeded successfully")

def seed_polling_data():
    """Membuat data dummy untuk polling"""
    with app.app_context():
        # Ambil admin user sebagai creator
        admin_user = User.query.filter_by(username='admin').first()
        if not admin_user:
            print("❌ Admin user tidak ditemukan! Seed admin user terlebih dahulu.")
            return False
        
        polling_data = [
            {
                'title': 'Prioritas Pembangunan Infrastruktur Kota Malang 2024',
                'description': 'Polling untuk menentukan prioritas pembangunan infrastruktur yang paling dibutuhkan masyarakat Kota Malang tahun 2024.',
                'category': 'Infrastruktur',
                'type': 'polling',
                'status': 'active',
                'end_date': datetime.now() + timedelta(days=30),
                'options': [
                    'Perbaikan jalan dan trotoar',
                    'Pembangunan taman kota',
                    'Peningkatan sistem drainase',
                    'Pembangunan fasilitas olahraga',
                    'Peningkatan transportasi publik'
                ]
            },
            {
                'title': 'Program Bantuan Sosial yang Paling Dibutuhkan',
                'description': 'Survey untuk mengetahui jenis bantuan sosial yang paling dibutuhkan masyarakat Kota Malang.',
                'category': 'Sosial',
                'type': 'survey',
                'status': 'active',
                'end_date': datetime.now() + timedelta(days=45),
                'options': [
                    'Bantuan sembako',
                    'Bantuan pendidikan',
                    'Bantuan kesehatan',
                    'Bantuan modal usaha',
                    'Bantuan perumahan'
                ]
            }
        ]
        
        for poll_data in polling_data:
            existing_poll = Polling.query.filter_by(title=poll_data['title']).first()
            if existing_poll:
                print(f"✅ Polling '{poll_data['title']}' already exists")
                continue
            
            # Create polling
            poll = Polling(
                title=poll_data['title'],
                description=poll_data['description'],
                category=poll_data['category'],
                type=poll_data['type'],
                status=poll_data['status'],
                end_date=poll_data['end_date'],
                created_by=admin_user.id
            )
            
            db.session.add(poll)
            db.session.flush()  # Get poll ID
            
            # Create polling options
            for option_text in poll_data['options']:
                option = PollingOption(
                    polling_id=poll.id,
                    option_text=option_text
                )
                db.session.add(option)
            
            print(f"✅ Polling '{poll_data['title']}' created with {len(poll_data['options'])} options")
        
        db.session.commit()
        print("✅ All Polling data seeded successfully")

def seed_events_data():
    """Membuat data event pendidikan politik"""
    with app.app_context():
        if EventPendidikanPolitik.query.count() > 0:
            print("✅ Event data already exists")
            return
        
        events_data = [
            {
                "title": "WEBINAR : PENDIDIKAN PEMILIH UNTUK GENERASI MUDA PERKOTAAN",
                "description": "Webinar tentang pentingnya pendidikan pemilih untuk generasi muda di perkotaan. Membahas strategi meningkatkan partisipasi politik generasi muda.",
                "event_date": datetime(2025, 12, 25, 10, 0),
                "location": "Online via Zoom",
                "organizer": "FISIP UB",
                "registration_link": "https://fisip.ub.ac.id/webinar-pendidikan-pemilih"
            },
            {
                "title": "Seminar Nasional Tema: UU Pemilu, kini dan nanti",
                "description": "Seminar nasional membahas perkembangan UU Pemilu dari masa ke masa dan proyeksi ke depan untuk sistem demokrasi Indonesia.",
                "event_date": datetime(2025, 12, 30, 9, 0),
                "location": "Widyaloka Universitas Brawijaya Malang",
                "organizer": "Universitas Brawijaya",
                "registration_link": "https://ub.ac.id/seminar-uu-pemilu"
            },
            {
                "title": "Workshop Literasi Politik untuk Mahasiswa",
                "description": "Workshop interaktif untuk meningkatkan literasi politik mahasiswa dan pemahaman tentang sistem pemerintahan Indonesia.",
                "event_date": datetime(2026, 1, 15, 13, 0),
                "location": "Auditorium Universitas Negeri Malang",
                "organizer": "Universitas Negeri Malang",
                "registration_link": "https://um.ac.id/workshop-literasi-politik"
            }
        ]
        
        for event_data in events_data:
            event = EventPendidikanPolitik(
                title=event_data["title"],
                description=event_data["description"],
                event_date=event_data["event_date"],
                location=event_data["location"],
                organizer=event_data["organizer"],
                registration_link=event_data["registration_link"]
            )
            db.session.add(event)
            print(f"✅ Event '{event_data['title']}' created")
        
        db.session.commit()
        print("✅ All Events data seeded successfully")

def run_all_seeds():
    """Menjalankan semua seeding data"""
    print("🚀 Starting SmartPol Database Seeding...\n")
    
    with app.app_context():
        try:
            # 1. Create admin user
            print("1️⃣ Creating admin user...")
            create_admin_user()
            print()
            
            # 2. Seed Dapil data
            print("2️⃣ Seeding Dapil data...")
            seed_dapil_data()
            print()
            
            # 3. Seed Officials data
            print("3️⃣ Seeding Officials data...")
            seed_officials_data()
            print()
            
            # 4. Seed Polling data
            print("4️⃣ Seeding Polling data...")
            seed_polling_data()
            print()
            
            # 5. Seed Events data
            print("5️⃣ Seeding Events data...")
            seed_events_data()
            print()
            
            print("🎉 All seeding completed successfully!")
            print("📋 Summary:")
            print(f"   - Admin users: {User.query.filter_by(role='admin').count()}")
            print(f"   - Dapil: {Dapil.query.count()}")
            print(f"   - Officials: {Officials.query.count()}")
            print(f"   - Polling: {Polling.query.count()}")
            print(f"   - Events: {EventPendidikanPolitik.query.count()}")
            
        except Exception as e:
            print(f"❌ Error during seeding: {e}")
            db.session.rollback()
            return False
        
        return True

if __name__ == '__main__':
    run_all_seeds()