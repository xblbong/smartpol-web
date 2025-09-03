#!/usr/bin/env python3
"""
Script untuk membuat data dummy polling dan policies di database SmartPol
"""

import sys
import os
from datetime import datetime, timedelta

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app, db, User, Polling, PollingOption, PollingVote, Policy

def create_dummy_polling():
    """Membuat data dummy untuk polling"""
    
    with app.app_context():
        # Ambil admin user sebagai creator
        admin_user = User.query.filter_by(username='admin').first()
        if not admin_user:
            print("❌ User admin tidak ditemukan! Jalankan create_admin_user.py terlebih dahulu.")
            return False
            
        # Data polling dummy
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
            },
            {
                'title': 'Evaluasi Kinerja Pelayanan Publik',
                'description': 'Polling untuk mengevaluasi kinerja pelayanan publik di berbagai instansi pemerintah Kota Malang.',
                'category': 'Pelayanan Publik',
                'type': 'polling',
                'status': 'active',
                'end_date': datetime.now() + timedelta(days=20),
                'options': [
                    'Sangat Baik',
                    'Baik',
                    'Cukup',
                    'Kurang',
                    'Sangat Kurang'
                ]
            },
            {
                'title': 'Rencana Pengembangan Wisata Kota Malang',
                'description': 'Polling untuk menentukan arah pengembangan sektor pariwisata Kota Malang ke depan.',
                'category': 'Pariwisata',
                'type': 'polling',
                'status': 'ended',
                'end_date': datetime.now() - timedelta(days=5),
                'options': [
                    'Wisata kuliner',
                    'Wisata sejarah',
                    'Wisata alam',
                    'Wisata edukasi',
                    'Wisata religi'
                ]
            },
            {
                'title': 'Kebijakan Jam Operasional Pusat Perbelanjaan',
                'description': 'Survey mengenai kebijakan jam operasional pusat perbelanjaan dan dampaknya terhadap masyarakat.',
                'category': 'Ekonomi',
                'type': 'survey',
                'status': 'active',
                'end_date': datetime.now() + timedelta(days=15),
                'options': [
                    'Setuju dengan jam operasional saat ini',
                    'Perlu diperpanjang hingga malam',
                    'Perlu dikurangi untuk keseimbangan',
                    'Disesuaikan dengan hari libur',
                    'Tidak ada pendapat'
                ]
            }
        ]
        
        created_count = 0
        for poll_data in polling_data:
            # Cek apakah polling sudah ada
            existing_poll = Polling.query.filter_by(title=poll_data['title']).first()
            if existing_poll:
                print(f"⚠️  Polling '{poll_data['title'][:50]}...' sudah ada, dilewati.")
                continue
                
            try:
                # Buat polling
                poll = Polling(
                    title=poll_data['title'],
                    description=poll_data['description'],
                    category=poll_data['category'],
                    type=poll_data['type'],
                    status=poll_data['status'],
                    end_date=poll_data['end_date'],
                    created_by=admin_user.id,
                    created_at=datetime.now(),
                    updated_at=datetime.now()
                )
                
                db.session.add(poll)
                db.session.flush()  # Untuk mendapatkan ID polling
                
                # Buat opsi polling
                for option_text in poll_data['options']:
                    option = PollingOption(
                        polling_id=poll.id,
                        option_text=option_text,
                        votes_count=0,
                        created_at=datetime.now()
                    )
                    db.session.add(option)
                
                db.session.commit()
                created_count += 1
                print(f"✅ Polling '{poll_data['title'][:50]}...' berhasil dibuat")
                
            except Exception as e:
                db.session.rollback()
                print(f"❌ Error membuat polling '{poll_data['title'][:50]}...': {str(e)}")
                
        if created_count > 0:
            print(f"\n✅ {created_count} polling berhasil dibuat!")
        else:
            print("\n⚠️  Tidak ada polling yang dibuat (mungkin sudah ada semua).")
            
        return True

def create_dummy_policies():
    """Membuat data dummy untuk policies"""
    
    with app.app_context():
        # Ambil admin user sebagai creator
        admin_user = User.query.filter_by(username='admin').first()
        if not admin_user:
            print("❌ User admin tidak ditemukan! Jalankan create_admin_user.py terlebih dahulu.")
            return False
            
        # Data policies dummy
        policies_data = [
            {
                'title': 'Peraturan Daerah tentang Pengelolaan Sampah',
                'description': 'Peraturan daerah yang mengatur pengelolaan sampah di Kota Malang untuk menciptakan lingkungan yang bersih dan sehat.',
                'content': '''PERATURAN DAERAH KOTA MALANG\nNOMOR 3 TAHUN 2024\nTENTANG PENGELOLAAN SAMPAH\n\nBAB I\nKETENTUAN UMUM\n\nPasal 1\nDalam Peraturan Daerah ini yang dimaksud dengan:\n1. Daerah adalah Kota Malang\n2. Pemerintah Daerah adalah Walikota beserta perangkat daerah\n3. Sampah adalah sisa kegiatan sehari-hari manusia dan/atau proses alam\n4. Pengelolaan sampah adalah kegiatan yang sistematis, menyeluruh, dan berkesinambungan\n\nBAB II\nASAS DAN TUJUAN\n\nPasal 2\nPengelolaan sampah berasaskan:\na. tanggung jawab\nb. berkelanjutan\nc. manfaat\nd. keadilan\ne. kesadaran\nf. kebersamaan\ng. keselamatan\nh. keamanan\ni. nilai ekonomi\n\nPasal 3\nPengelolaan sampah bertujuan:\na. meningkatkan kesehatan masyarakat dan kualitas lingkungan\nb. menjadikan sampah sebagai sumber daya\nc. mengurangi sampah\nd. memanfaatkan sampah''',
                'category': 'Lingkungan',
                'status': 'approved',
                'policy_type': 'perda',
                'effective_date': datetime.now() + timedelta(days=90)
            },
            {
                'title': 'Kebijakan Pengembangan UMKM Kota Malang',
                'description': 'Kebijakan untuk mendukung pengembangan Usaha Mikro, Kecil, dan Menengah (UMKM) di Kota Malang.',
                'content': '''KEBIJAKAN PENGEMBANGAN UMKM KOTA MALANG\n\nI. LATAR BELAKANG\nUsaha Mikro, Kecil, dan Menengah (UMKM) merupakan tulang punggung perekonomian daerah yang perlu mendapat dukungan penuh dari pemerintah daerah.\n\nII. TUJUAN\n1. Meningkatkan daya saing UMKM\n2. Memperluas akses pasar\n3. Memberikan kemudahan perizinan\n4. Meningkatkan akses permodalan\n\nIII. STRATEGI PENGEMBANGAN\n1. Pemberian bantuan modal usaha\n2. Pelatihan keterampilan dan manajemen\n3. Fasilitasi pemasaran produk\n4. Penyediaan tempat usaha\n5. Kemudahan perizinan\n\nIV. PROGRAM UNGGULAN\n1. Malang Creative Hub\n2. Pasar Digital UMKM\n3. Inkubator Bisnis\n4. Festival UMKM Tahunan\n\nV. INDIKATOR KEBERHASILAN\n1. Peningkatan jumlah UMKM\n2. Peningkatan omzet UMKM\n3. Penyerapan tenaga kerja\n4. Kontribusi terhadap PAD''',
                'category': 'Ekonomi',
                'status': 'submitted',
                'policy_type': 'kebijakan',
                'effective_date': datetime.now() + timedelta(days=60)
            },
            {
                'title': 'Regulasi Transportasi Online di Kota Malang',
                'description': 'Regulasi yang mengatur operasional transportasi online untuk menciptakan persaingan yang sehat dan melindungi konsumen.',
                'content': '''REGULASI TRANSPORTASI ONLINE KOTA MALANG\n\nBAB I\nKETENTUAN UMUM\n\nPasal 1\nDalam regulasi ini yang dimaksud dengan:\n1. Transportasi Online adalah layanan transportasi yang menggunakan aplikasi\n2. Penyelenggara adalah perusahaan penyedia platform\n3. Mitra Pengemudi adalah pengemudi yang bermitra\n\nBAB II\nPERSYARATAN OPERASIONAL\n\nPasal 2\nPenyelenggara wajib:\na. Memiliki izin operasional\nb. Memastikan keselamatan penumpang\nc. Menyediakan asuransi\nd. Melakukan verifikasi pengemudi\n\nPasal 3\nMitra Pengemudi wajib:\na. Memiliki SIM yang valid\nb. Mengikuti pelatihan keselamatan\nc. Menjaga kebersihan kendaraan\nd. Memberikan pelayanan prima\n\nBAB III\nTARIF DAN PERSAINGAN\n\nPasal 4\nPenetapan tarif harus:\na. Mempertimbangkan keadilan\nb. Tidak merugikan transportasi konvensional\nc. Transparan kepada konsumen\n\nBAB IV\nSANKSI\n\nPasal 5\nPelanggaran dikenai sanksi:\na. Teguran tertulis\nb. Pembekuan izin\nc. Pencabutan izin''',
                'category': 'Transportasi',
                'status': 'draft',
                'policy_type': 'regulasi',
                'effective_date': None
            },
            {
                'title': 'Peraturan Daerah tentang Retribusi Parkir',
                'description': 'Peraturan daerah yang mengatur retribusi parkir di wilayah Kota Malang untuk meningkatkan Pendapatan Asli Daerah.',
                'content': '''PERATURAN DAERAH KOTA MALANG\nNOMOR 5 TAHUN 2024\nTENTANG RETRIBUSI PARKIR\n\nBAB I\nKETENTUAN UMUM\n\nPasal 1\nDalam Peraturan Daerah ini yang dimaksud dengan:\n1. Retribusi adalah pungutan daerah\n2. Parkir adalah tempat pemberhentian kendaraan\n3. Wajib Retribusi adalah orang atau badan yang menggunakan jasa parkir\n\nBAB II\nOBJEK DAN SUBJEK RETRIBUSI\n\nPasal 2\nObjek retribusi parkir adalah:\na. Penyediaan pelayanan parkir di tepi jalan umum\nb. Penyediaan pelayanan parkir di luar tepi jalan umum\n\nPasal 3\nSubjek retribusi adalah orang atau badan yang menggunakan jasa parkir\n\nBAB III\nSTRUKTUR DAN BESARAN TARIF\n\nPasal 4\nTarif retribusi parkir:\na. Sepeda motor: Rp 2.000 per jam\nb. Mobil: Rp 3.000 per jam\nc. Bus/Truck: Rp 5.000 per jam\n\nBAB IV\nTATA CARA PEMUNGUTAN\n\nPasal 5\nPemungutan retribusi dilakukan dengan:\na. Karcis parkir\nb. Sistem elektronik\nc. Sistem lainnya yang sah\n\nBAB V\nKETENTUAN PENUTUP\n\nPasal 6\nPeraturan Daerah ini mulai berlaku pada tanggal diundangkan.''',
                'category': 'Keuangan',
                'status': 'approved',
                'policy_type': 'perda',
                'effective_date': datetime.now() + timedelta(days=30)
            },
            {
                'title': 'Kebijakan Digitalisasi Pelayanan Publik',
                'description': 'Kebijakan untuk mempercepat digitalisasi pelayanan publik di Kota Malang guna meningkatkan efisiensi dan transparansi.',
                'content': '''KEBIJAKAN DIGITALISASI PELAYANAN PUBLIK\nKOTA MALANG\n\nI. PENDAHULUAN\nDigitalisasi pelayanan publik merupakan kebutuhan mendesak untuk meningkatkan kualitas pelayanan kepada masyarakat.\n\nII. VISI DAN MISI\nVisi: Terwujudnya pelayanan publik yang digital, efisien, dan transparan\nMisi:\n1. Mengintegrasikan sistem pelayanan\n2. Meningkatkan literasi digital\n3. Mempercepat proses pelayanan\n\nIII. PROGRAM DIGITALISASI\n1. Sistem Informasi Pelayanan Terpadu (SIPT)\n2. Aplikasi Mobile Pelayanan\n3. Portal Satu Data Malang\n4. E-Government Dashboard\n\nIV. TAHAPAN IMPLEMENTASI\nFase 1 (6 bulan): Persiapan infrastruktur\nFase 2 (12 bulan): Pengembangan sistem\nFase 3 (6 bulan): Uji coba dan sosialisasi\nFase 4 (ongoing): Operasional penuh\n\nV. INDIKATOR KEBERHASILAN\n1. Waktu pelayanan berkurang 50%\n2. Kepuasan masyarakat meningkat\n3. Transparansi informasi 100%\n4. Paperless office tercapai\n\nVI. ANGGARAN\nTotal anggaran: Rp 15 miliar\nSumber: APBD dan hibah\n\nVII. PENUTUP\nKebijakan ini menjadi pedoman digitalisasi pelayanan publik di Kota Malang.''',
                'category': 'Teknologi',
                'status': 'submitted',
                'policy_type': 'kebijakan',
                'effective_date': datetime.now() + timedelta(days=120)
            }
        ]
        
        created_count = 0
        for policy_data in policies_data:
            # Cek apakah policy sudah ada
            existing_policy = Policy.query.filter_by(title=policy_data['title']).first()
            if existing_policy:
                print(f"⚠️  Policy '{policy_data['title'][:50]}...' sudah ada, dilewati.")
                continue
                
            try:
                # Buat policy
                policy = Policy(
                    title=policy_data['title'],
                    description=policy_data['description'],
                    content=policy_data['content'],
                    category=policy_data['category'],
                    status=policy_data['status'],
                    policy_type=policy_data['policy_type'],
                    effective_date=policy_data['effective_date'],
                    created_by=admin_user.id,
                    created_at=datetime.now(),
                    updated_at=datetime.now()
                )
                
                db.session.add(policy)
                db.session.commit()
                
                created_count += 1
                print(f"✅ Policy '{policy_data['title'][:50]}...' berhasil dibuat")
                
            except Exception as e:
                db.session.rollback()
                print(f"❌ Error membuat policy '{policy_data['title'][:50]}...': {str(e)}")
                
        if created_count > 0:
            print(f"\n✅ {created_count} policy berhasil dibuat!")
        else:
            print("\n⚠️  Tidak ada policy yang dibuat (mungkin sudah ada semua).")
            
        return True

def create_sample_votes():
    """Membuat beberapa vote dummy untuk polling"""
    
    with app.app_context():
        # Ambil user untuk voting
        users = User.query.filter(User.username.in_(['user1', 'user2', 'user3'])).all()
        if not users:
            print("⚠️  User test tidak ditemukan, vote dummy tidak dibuat.")
            return
            
        # Ambil polling yang aktif
        active_polls = Polling.query.filter_by(status='active').all()
        if not active_polls:
            print("⚠️  Tidak ada polling aktif, vote dummy tidak dibuat.")
            return
            
        vote_count = 0
        for poll in active_polls[:3]:  # Hanya 3 polling pertama
            options = PollingOption.query.filter_by(polling_id=poll.id).all()
            if not options:
                continue
                
            for user in users:
                # Cek apakah user sudah vote
                existing_vote = PollingVote.query.filter_by(
                    polling_id=poll.id, 
                    user_id=user.id
                ).first()
                
                if existing_vote:
                    continue
                    
                # Pilih opsi secara acak
                import random
                selected_option = random.choice(options)
                
                try:
                    # Buat vote
                    vote = PollingVote(
                        polling_id=poll.id,
                        option_id=selected_option.id,
                        user_id=user.id,
                        voted_at=datetime.now()
                    )
                    
                    db.session.add(vote)
                    
                    # Update vote count
                    selected_option.votes_count += 1
                    
                    vote_count += 1
                    
                except Exception as e:
                    print(f"❌ Error membuat vote: {str(e)}")
                    continue
                    
        try:
            db.session.commit()
            if vote_count > 0:
                print(f"✅ {vote_count} vote dummy berhasil dibuat!")
            else:
                print("⚠️  Tidak ada vote yang dibuat (mungkin sudah ada semua).")
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error menyimpan votes: {str(e)}")

if __name__ == '__main__':
    print("🚀 Membuat data dummy polling dan policies...\n")
    
    # Buat dummy polling
    print("📊 Membuat data polling dummy...")
    create_dummy_polling()
    
    print("\n" + "="*50 + "\n")
    
    # Buat dummy policies
    print("📋 Membuat data policy dummy...")
    create_dummy_policies()
    
    print("\n" + "="*50 + "\n")
    
    # Buat sample votes
    print("🗳️  Membuat vote dummy...")
    create_sample_votes()
    
    print("\n🎉 Selesai! Data dummy berhasil dibuat.")