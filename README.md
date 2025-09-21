# SmartPol Chatbot - Tutorial Hosting dan Deployment

## 👥 User Default Hasil Seeding

### Admin User:
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: Administrator
- **Email**: `admin@smartpol.com`

### User Konstituen Sample:
1. **Budi Santoso**
   - **NIK**: `3573010101900001`
   - **Username**: `budi_santoso`
   - **Password**: `password123`
   - **Alamat**: Jl. Veteran No. 1, Klojen, Malang
   - **Status**: NIK Verified ✅

2. **Siti Aminah**
   - **NIK**: `3573010202850002`
   - **Username**: `siti_aminah`
   - **Password**: `password123`
   - **Alamat**: Jl. Ijen No. 25, Klojen, Malang
   - **Status**: NIK Verified ✅

3. **Ahmad Wijaya**
   - **NIK**: `3573010303920003`
   - **Username**: `ahmad_wijaya`
   - **Password**: `password123`
   - **Alamat**: Jl. Semeru No. 10, Lowokwaru, Malang
   - **Status**: NIK Verified ✅

---

Panduan lengkap untuk menjalankan aplikasi SmartPol Chatbot di server hosting.

## 📋 Daftar Isi

1. [Persyaratan Sistem](#persyaratan-sistem)
2. [Instalasi](#instalasi)
3. [Konfigurasi Database](#konfigurasi-database)
4. [Seeding Data](#seeding-data)
5. [Menjalankan Aplikasi](#menjalankan-aplikasi)
6. [Deployment ke Production](#deployment-ke-production)
7. [Troubleshooting](#troubleshooting)

## 🔧 Persyaratan Sistem

### Minimum Requirements:
- **Python**: 3.8 atau lebih baru
- **MySQL**: 5.7 atau lebih baru (atau MariaDB 10.2+)
- **RAM**: Minimum 1GB, Recommended 2GB+
- **Storage**: Minimum 500MB free space
- **OS**: Linux (Ubuntu 18.04+), Windows 10+, atau macOS 10.14+

### Dependencies:
- Flask 2.3.3
- SQLAlchemy
- PyMySQL
- Flask-CORS
- Werkzeug

## 🚀 Instalasi

### 1. Clone Repository
```bash
git clone https://github.com/your-repo/smartpol-chatbot.git
cd smartpol-chatbot
```

### 2. Setup Virtual Environment
```bash
# Untuk Linux/macOS
python3 -m venv venv
source venv/bin/activate

# Untuk Windows
python -m venv venv
venv\Scripts\activate
```

### 3. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 4. Install MySQL (jika belum ada)

#### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install mysql-server mysql-client
sudo mysql_secure_installation
```

#### CentOS/RHEL:
```bash
sudo yum install mysql-server mysql
sudo systemctl start mysqld
sudo mysql_secure_installation
```

#### Windows:
Download dan install MySQL dari [official website](https://dev.mysql.com/downloads/mysql/)

## 🗄️ Konfigurasi Database

### 1. Buat Database
```sql
mysql -u root -p
CREATE DATABASE smartpol_chatbot CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'smartpol_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON smartpol_chatbot.* TO 'smartpol_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2. Konfigurasi Environment Variables
Buat file `.env` di folder `backend/`:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=smartpol_user
DB_PASSWORD=your_secure_password
DB_NAME=smartpol_chatbot
DATABASE_URL=mysql+pymysql://smartpol_user:your_secure_password@localhost:3306/smartpol_chatbot

# Flask Configuration
FLASK_ENV=production
SECRET_KEY=your_very_secure_secret_key_here
DEBUG=False

# Security
CORS_ORIGINS=https://yourdomain.com
```

**⚠️ PENTING**: Ganti `your_secure_password` dan `your_very_secure_secret_key_here` dengan nilai yang aman!

### 3. Test Koneksi Database
```bash
cd backend
python -c "
import os
from dotenv import load_dotenv
load_dotenv()
import pymysql
try:
    conn = pymysql.connect(
        host=os.getenv('DB_HOST'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        database=os.getenv('DB_NAME')
    )
    print('✅ Database connection successful!')
    conn.close()
except Exception as e:
    print(f'❌ Database connection failed: {e}')
"
```

## 🌱 Seeding Data

### 1. Inisialisasi Database
```bash
cd backend
python -c "
from app import app, db
with app.app_context():
    db.create_all()
    print('✅ Database tables created successfully!')
"
```

### 2. Jalankan Seeding
```bash
python seed_data.py
```

Proses seeding akan membuat:
- ✅ Data Dapil (Daerah Pemilihan) untuk Kota Malang
- ✅ User admin default
- ✅ User konstituen sample (3 user)
- ✅ Data officials (pejabat)
- ✅ Sample policies dan events

### 3. Verifikasi Seeding
```bash
python -c "
from app import app, db, User, Dapil
with app.app_context():
    users = User.query.count()
    dapils = Dapil.query.count()
    print(f'✅ Users created: {users}')
    print(f'✅ Dapils created: {dapils}')
    
    # Test admin login
    admin = User.query.filter_by(role='admin').first()
    if admin:
        print(f'✅ Admin user: {admin.username}')
    
    # Test dapil data
    malang_dapils = Dapil.query.filter(Dapil.name.like('%MALANG%')).all()
    print(f'✅ Malang Dapils: {len(malang_dapils)}')
"
```

## 🏃‍♂️ Menjalankan Aplikasi

### 1. Development Mode
```bash
cd backend
python app.py
```

Aplikasi akan berjalan di: `http://localhost:5000`

### 2. Production Mode dengan Gunicorn
```bash
# Install Gunicorn
pip install gunicorn

# Jalankan dengan Gunicorn
gunicorn --bind 0.0.0.0:5000 --workers 4 app:app
```

### 3. Dengan Nginx (Recommended untuk Production)

#### Install Nginx:
```bash
# Ubuntu/Debian
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

#### Konfigurasi Nginx (`/etc/nginx/sites-available/smartpol`):
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static {
        alias /path/to/smartpol-chatbot/backend/static;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Aktifkan konfigurasi:
```bash
sudo ln -s /etc/nginx/sites-available/smartpol /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🚀 Deployment ke Production

### 1. Setup Systemd Service
Buat file `/etc/systemd/system/smartpol.service`:

```ini
[Unit]
Description=SmartPol Chatbot
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/path/to/smartpol-chatbot/backend
Environment=PATH=/path/to/smartpol-chatbot/venv/bin
ExecStart=/path/to/smartpol-chatbot/venv/bin/gunicorn --bind 127.0.0.1:5000 --workers 4 app:app
Restart=always

[Install]
WantedBy=multi-user.target
```

### 2. Aktifkan Service
```bash
sudo systemctl daemon-reload
sudo systemctl enable smartpol
sudo systemctl start smartpol
sudo systemctl status smartpol
```

### 3. Setup SSL dengan Let's Encrypt
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Dapatkan SSL Certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Tambahkan: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 4. Backup Database (Automated)
Buat script backup `/home/user/backup_smartpol.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/user/backups"
DB_NAME="smartpol_chatbot"
DB_USER="smartpol_user"
DB_PASS="your_secure_password"

mkdir -p $BACKUP_DIR
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > $BACKUP_DIR/smartpol_$DATE.sql
gzip $BACKUP_DIR/smartpol_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "smartpol_*.sql.gz" -mtime +7 -delete
```

Jadwalkan dengan cron:
```bash
crontab -e
# Tambahkan: 0 2 * * * /home/user/backup_smartpol.sh
```

## 🔧 Troubleshooting

### Database Connection Issues
```bash
# Check MySQL status
sudo systemctl status mysql

# Check MySQL logs
sudo tail -f /var/log/mysql/error.log

# Test connection manually
mysql -u smartpol_user -p smartpol_chatbot
```

### Application Errors
```bash
# Check application logs
sudo journalctl -u smartpol -f

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Performance Issues
```bash
# Monitor system resources
htop
df -h
free -h

# Check database performance
mysql -u root -p -e "SHOW PROCESSLIST;"
```

### Common Issues & Solutions

#### 1. "ModuleNotFoundError"
```bash
# Pastikan virtual environment aktif
source venv/bin/activate
pip install -r requirements.txt
```

#### 2. "Access denied for user"
```bash
# Reset MySQL password
sudo mysql
ALTER USER 'smartpol_user'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
```

#### 3. "Port 5000 already in use"
```bash
# Find process using port
sudo lsof -i :5000
# Kill process
sudo kill -9 <PID>
```

#### 4. "Permission denied"
```bash
# Fix file permissions
sudo chown -R www-data:www-data /path/to/smartpol-chatbot
sudo chmod -R 755 /path/to/smartpol-chatbot
```

## 📊 Monitoring & Maintenance

### 1. Log Monitoring
```bash
# Setup log rotation
sudo nano /etc/logrotate.d/smartpol

/var/log/smartpol/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
}
```

### 2. Health Check Script
Buat `/home/user/health_check.sh`:

```bash
#!/bin/bash
URL="http://localhost:5000/api/health"
if curl -f -s $URL > /dev/null; then
    echo "✅ Application is healthy"
else
    echo "❌ Application is down, restarting..."
    sudo systemctl restart smartpol
fi
```

### 3. Update Procedure
```bash
# 1. Backup database
./backup_smartpol.sh

# 2. Pull latest code
git pull origin main

# 3. Update dependencies
pip install -r requirements.txt

# 4. Run migrations (if any)
python -c "from app import app, db; app.app_context().push(); db.create_all()"

# 5. Restart service
sudo systemctl restart smartpol
```

## 🔐 Security Checklist

- [ ] Database user memiliki password yang kuat
- [ ] SECRET_KEY menggunakan nilai random yang aman
- [ ] SSL/TLS certificate terpasang dan valid
- [ ] Firewall dikonfigurasi dengan benar
- [ ] Regular backup database
- [ ] Log monitoring aktif
- [ ] Update sistem operasi secara berkala
- [ ] Monitoring keamanan aplikasi

## 📞 Support

Jika mengalami masalah:

1. Periksa log aplikasi dan database
2. Pastikan semua dependencies terinstall
3. Verifikasi konfigurasi database dan environment variables
4. Restart service jika diperlukan

---

**Selamat! Aplikasi SmartPol Chatbot siap digunakan di production! 🎉**
