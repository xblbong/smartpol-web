# SmartPol Chatbot

Aplikasi web chatbot politik yang dibangun dengan React.js (frontend) dan Flask (backend) untuk memberikan informasi dan layanan terkait politik kepada konsituen. Aplikasi ini dilengkapi dengan sistem admin, polling, kebijakan, dan pelaporan yang komprehensif.

## 🚀 Quick Start untuk Developer

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- MySQL Server (Laragon/XAMPP)
- Git

### Setup Cepat (5 Menit)

```bash
# 1. Clone dan masuk ke direktori
git clone <repository-url>
cd smartpol-chatbot

# 2. Setup Database
# Buka phpMyAdmin atau MySQL client, buat database:
# CREATE DATABASE smartpol_chatbot;

# 3. Backend Setup
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt

# 4. Buat file .env di folder backend/
echo "DB_HOST=localhost" > .env
echo "DB_PORT=3306" >> .env
echo "DB_NAME=smartpol_chatbot" >> .env
echo "DB_USER=root" >> .env
echo "DB_PASSWORD=" >> .env
echo "DATABASE_URL=mysql+pymysql://root:@localhost:3306/smartpol_chatbot" >> .env
echo "JWT_SECRET_KEY=your-secret-key-here" >> .env
echo "FLASK_ENV=development" >> .env
echo "FLASK_DEBUG=True" >> .env

# 5. Inisialisasi Database dan Data
python create_report_table.py
python create_admin_user.py
python create_test_users_for_auth.py
python create_dummy_data.py

# 5a. (Opsional) Test Authentication System
python test_role_authentication.py  # Validasi sistem autentikasi role-based

# 6. Jalankan Backend
python app.py
# Backend berjalan di http://localhost:5000

# 7. Frontend Setup (terminal baru)
cd ..
npm install
npm run dev
# Frontend berjalan di http://localhost:5173
```

### Login Credentials untuk Testing

**Admin:**
- URL: http://localhost:5173/admin-login
- Username: `admin`
- Password: `admin123`

**Test Users:**
- Username: `konsituen_user` | Password: `password123` (Role: konsituen)
- Username: `dpri_user` | Password: `password123` (Role: dpri)
- Username: `dprd_user` | Password: `password123` (Role: dprd)
- Username: `pimpinan_user` | Password: `password123` (Role: pimpinan_daerah)
- Username: `moderator_user` | Password: `password123` (Role: moderator)

### Testing Features

1. **User Authentication & Role-based Access:**
   - Test login dengan berbagai role
   - Verifikasi akses halaman berdasarkan role
   - Test logout functionality

2. **Admin Dashboard:**
   - Login sebagai admin
   - Test semua fitur admin (users, polls, policies, reports)
   - Verifikasi statistik dan analytics

3. **Polling System:**
   - Buat polling baru (admin)
   - Vote pada polling (user)
   - Lihat hasil polling

4. **Report System:**
   - Submit laporan (user)
   - Kelola laporan (admin)
   - Test status tracking

5. **Policy Management:**
   - CRUD operations untuk kebijakan
   - Test kategorisasi dan pencarian

### Testing & Validation Scripts

Project ini dilengkapi dengan script testing untuk memvalidasi sistem:

```bash
# Test sistem autentikasi role-based
cd backend
python test_role_authentication.py

# Buat user test dengan berbagai role
python create_test_users_for_auth.py

# Test koneksi database
python test_db_connection.py

# Test endpoint admin
python test_admin_endpoints.py

# Cek data user dan role
python check_user_data.py
```

### Troubleshooting Cepat

```bash
# Database connection error
# Pastikan MySQL berjalan dan database sudah dibuat

# Port sudah digunakan
netstat -ano | findstr :5000  # Backend
netstat -ano | findstr :5173  # Frontend

# Reset environment
rmdir /s venv && python -m venv venv  # Backend
rmdir /s node_modules && npm install  # Frontend

# Jika ada error syntax di frontend
npm run build  # Check untuk TypeScript errors
```

## 🔧 Recent Bug Fixes & Improvements

### ✅ Critical Error Fixes (Latest Update)

**1. Fixed Deprecated Tabs.TabPane Warning**
- **File**: `pages/admin/MonthlyReport.jsx`
- **Issue**: Ant Design deprecated `Tabs.TabPane` component causing console warnings
- **Solution**: Converted to modern `items` array format for Tabs component
- **Impact**: Eliminates deprecation warnings and ensures future compatibility

**2. Fixed TypeError in ErrorBoundary Component**
- **File**: `components/ErrorBoundary.jsx`
- **Issue**: `Cannot read properties of null (reading 'componentStack')` error
- **Solution**: Added null checks before accessing `errorInfo.componentStack`
- **Impact**: Prevents crashes when error boundary renders with null errorInfo

**3. Fixed Array Method Error in ReportPolling**
- **File**: `pages/admin/ReportPolling.jsx`
- **Issue**: `activitiesData.map is not a function` error when data is not an array
- **Solution**: Added `Array.isArray()` validation before calling `.map()` method
- **Impact**: Prevents runtime errors when API returns unexpected data format

### 🚀 Performance & Stability Improvements

- **Enhanced Error Handling**: All components now have proper error boundaries and validation
- **Type Safety**: Added runtime type checking for API responses
- **UI Consistency**: Updated deprecated components to modern Ant Design patterns
- **Developer Experience**: Eliminated console warnings and improved debugging

### 🧪 Testing Status

- ✅ All critical errors resolved
- ✅ Application runs without console errors
- ✅ Admin dashboard fully functional
- ✅ Error boundaries working correctly
- ✅ Polling and reporting features stable

## 🚀 Teknologi yang Digunakan

### Frontend
- **React.js** - Library JavaScript untuk membangun user interface
- **Vite** - Build tool yang cepat untuk development
- **Ant Design** - UI component library untuk React
- **React Router** - Routing untuk single page application
- **Axios** - HTTP client untuk komunikasi dengan backend
- **Tailwind CSS** - Utility-first CSS framework
- **Chart.js** - Library untuk visualisasi data dan grafik
- **Day.js** - Library untuk manipulasi tanggal

### Backend
- **Flask** - Web framework Python yang ringan
- **SQLAlchemy** - ORM untuk database operations
- **Flask-JWT-Extended** - JWT authentication untuk Flask
- **Flask-CORS** - Cross-Origin Resource Sharing
- **PyMySQL** - MySQL database connector
- **Werkzeug** - Password hashing dan security utilities
- **Flask-Migrate** - Database migration tool

### Database
- **MySQL** - Relational database management system

## 📁 Struktur Project

```
smartpol-chatbot/
├── backend/                    # Backend Flask application
│   ├── .env                   # Environment variables
│   ├── app.py                 # Main Flask application (✅ Updated)
│   ├── requirements.txt       # Python dependencies
│   ├── README.md             # Backend documentation
│   ├── create_admin_user.py   # Script untuk membuat admin user
│   ├── create_dummy_data.py   # Script untuk data dummy
│   ├── create_report_table.py # Script untuk tabel report
│   ├── create_test_users_for_auth.py # 🆕 Script untuk test users
│   ├── test_role_authentication.py   # 🆕 Script testing autentikasi
│   ├── check_user_data.py     # 🆕 Script validasi user data
│   ├── test_admin_endpoints.py # 🆕 Script testing admin endpoints
│   ├── migrations/           # Database migrations
│   └── instance/
│       └── smartpol.db       # SQLite database (legacy)
├── src/                       # Frontend React application
│   ├── components/           # Reusable React components
│   │   ├── AdminProtectedRoute.jsx  # Admin route protection (✅ Updated)
│   │   ├── ProtectedRoute.jsx       # User route protection (✅ Updated)
│   │   ├── ButtonComponent.jsx
│   │   ├── FormComponent.jsx
│   │   ├── HeaderForm.jsx
│   │   ├── InputComponents.jsx
│   │   ├── ChatBubble.jsx          # Chat bubble component
│   │   ├── ChatContainer.jsx       # Chat container
│   │   ├── ChatHistory.jsx         # Chat history
│   │   ├── CategoryDistributionChart.jsx # Chart component
│   │   ├── Tutorial.jsx            # Tutorial component
│   │   └── layouts/               # Layout components
│   ├── pages/                # Page components
│   │   ├── Admin.jsx             # Admin dashboard (✅ Fixed Syntax Errors)
│   │   ├── Policies.jsx          # Policies page
│   │   ├── Polling.jsx           # Polling page
│   │   ├── Settings.jsx          # Settings page
│   │   ├── Credits.jsx           # Credits page
│   │   ├── NikVerification.jsx   # NIK verification
│   │   ├── NotFound.jsx
│   │   ├── auth/                 # Authentication pages
│   │   │   ├── Login.jsx         # (✅ Enhanced Role Validation)
│   │   │   ├── Register.jsx      # (✅ Enhanced Role Validation)
│   │   │   └── AdminLogin.jsx    # Admin login page (✅ Updated)
│   │   └── home/                 # Home pages
│   │       ├── Home.jsx
│   │       └── Chat.jsx          # Chat page
│   ├── hooks/                # Custom React hooks
│   │   └── useChat.js           # Chat functionality hook
│   ├── services/             # API services
│   │   └── api.js           # Axios configuration dan API calls (✅ Updated)
│   ├── App.jsx              # Main App component (✅ Enhanced Routing)
│   ├── main.jsx             # React entry point
│   └── index.css            # Global styles
├── public/                   # Static assets
│   ├── images/              # Image assets
│   │   ├── logo.png
│   │   ├── kota-malang.jpg
│   │   ├── avatar1.jpg
│   │   └── avatar2.jpg
│   └── vite.svg
├── package.json             # Frontend dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── README.md               # Project documentation
```

### 🔧 Key Files Updated

**Backend (Python/Flask):**
- `app.py` - Enhanced role-based authentication logic
- `create_test_users_for_auth.py` - Script untuk membuat test users dengan berbagai role
- `test_role_authentication.py` - Script testing sistem autentikasi
- `check_user_data.py` - Script validasi data user dan role
- `test_admin_endpoints.py` - Script testing endpoint admin

**Frontend (React/Vite):**
- `pages/Admin.jsx` - Fixed syntax errors & enhanced error handling
- `pages/admin/MonthlyReport.jsx` - ✅ Fixed deprecated Tabs.TabPane warning by converting to items array format
- `pages/admin/ReportPolling.jsx` - ✅ Fixed 'activitiesData.map is not a function' error with array validation
- `components/ErrorBoundary.jsx` - ✅ Fixed TypeError 'Cannot read properties of null' with null checks
- `components/AdminProtectedRoute.jsx` - Enhanced role validation
- `components/ProtectedRoute.jsx` - Improved authentication handling
- `pages/auth/Login.jsx` - Enhanced role validation UI
- `pages/auth/Register.jsx` - Enhanced role validation UI
- `pages/auth/AdminLogin.jsx` - Improved admin authentication
- `services/api.js` - Updated API handling dengan error management
- `App.jsx` - Enhanced routing dengan role protection

## 🔧 Setup dan Instalasi

### Prerequisites
- **Node.js** (v16 atau lebih baru) - [Download](https://nodejs.org/)
- **Python** (v3.8 atau lebih baru) - [Download](https://python.org/)
- **MySQL Server** - Laragon, XAMPP, atau MySQL standalone
- **Git** - [Download](https://git-scm.com/)

### 🚀 Quick Start Guide

#### 1. Clone Repository
```bash
git clone <repository-url>
cd smartpol-chatbot
```

#### 2. Database Setup

**Menggunakan Laragon (Recommended):**
1. Start Laragon
2. Buka phpMyAdmin atau MySQL client
3. Buat database baru:
   ```sql
   CREATE DATABASE smartpol_chatbot;
   ```

**Menggunakan XAMPP:**
1. Start Apache dan MySQL di XAMPP Control Panel
2. Buka http://localhost/phpmyadmin
3. Buat database `smartpol_chatbot`

#### 3. Backend Setup

```bash
# Masuk ke direktori backend
cd backend

# Buat virtual environment
python -m venv venv

# Aktivasi virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Konfigurasi Environment Variables:**
Buat file `.env` di folder `backend/` dengan isi:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=smartpol_chatbot
DB_USER=root
DB_PASSWORD=
DATABASE_URL=mysql+pymysql://root:@localhost:3306/smartpol_chatbot

# JWT Configuration
JWT_SECRET_KEY=your-secret-key-here

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
```

**Inisialisasi Database:**
```bash
# Jalankan script untuk membuat tabel
python create_report_table.py

# Buat admin user (opsional)
python create_admin_user.py

# Buat data dummy untuk testing (opsional)
python create_dummy_data.py
```

**Jalankan Backend Server:**
```bash
python app.py
```
✅ Backend akan berjalan di `http://localhost:5000`

#### 4. Frontend Setup

```bash
# Kembali ke root directory
cd ..

# Install dependencies
npm install

# Jalankan development server
npm run dev
```
✅ Frontend akan berjalan di `http://localhost:5173`

### 🔧 Development Workflow

#### Menjalankan Aplikasi untuk Development

1. **Terminal 1 - Backend:**
   ```bash
   cd backend
   venv\Scripts\activate  # Windows
   python app.py
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   npm run dev
   ```

3. **Akses Aplikasi:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - Admin Login: http://localhost:5173/admin-login

#### Default Login Credentials

**Admin User:**
- Username: ` `
- Password: `admin123`

**Test User:**
- Username: `testuser`
- Password: `password123`

### 🛠️ Troubleshooting

#### Common Issues

**1. Database Connection Error:**
```bash
# Pastikan MySQL service berjalan
# Cek konfigurasi di .env file
# Pastikan database sudah dibuat
```

**2. Port Already in Use:**
```bash
# Backend (Port 5000)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Frontend (Port 5173)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

**3. Python Virtual Environment Issues:**
```bash
# Hapus venv dan buat ulang
rmdir /s venv
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

**4. Node Modules Issues:**
```bash
# Hapus node_modules dan install ulang
rmdir /s node_modules
npm install
```

### 📱 Testing Features

#### User Features
1. **Registrasi**: Buat akun baru di `/register`
2. **Login**: Login dengan akun yang sudah dibuat
3. **Chat**: Test fitur chat di halaman utama
4. **Polling**: Ikuti polling yang tersedia
5. **Policies**: Lihat kebijakan yang ada
6. **Reports**: Submit laporan baru

#### Admin Features
1. **Admin Login**: Login sebagai admin di `/admin-login`
2. **Dashboard**: Lihat statistik di admin dashboard
3. **User Management**: Kelola user di tab Users
4. **Poll Management**: Buat dan kelola polling
5. **Policy Management**: Buat dan kelola kebijakan
6. **Report Management**: Kelola laporan dari user

### 🔄 Database Migration

Jika ada perubahan struktur database:

```bash
cd backend

# Initialize migration (first time only)
flask db init

# Create migration
flask db migrate -m "Description of changes"

# Apply migration
flask db upgrade
```

## ✨ Fitur Utama

### 🔐 Authentication System

#### User Authentication
- **Registrasi**: Username, nama lengkap, email, role, deskripsi, password
- **Login**: Username/password dengan JWT token
- **Logout**: Token blacklisting untuk keamanan
- **Protected Routes**: Route protection untuk user dan admin
- **Role-based Access Control**: Sistem validasi role yang membatasi akses berdasarkan role user
- **Allowed Roles**: konsituen, dpri, dprd, pimpinan_daerah (role lain akan diblokir)
- **Error Handling**: Pesan error yang jelas untuk role yang tidak diizinkan

#### Admin Authentication
- **Admin Login**: Sistem login terpisah untuk admin di `/admin-login`
- **Admin Dashboard**: Dashboard khusus dengan akses penuh
- **Admin Portal Access**: Admin dapat login melalui portal admin terpisah
- **Role Validation**: Validasi role admin di frontend dan backend

### 💬 Chat System
- **Real-time Chat**: Interface chat yang responsif
- **Chat History**: Riwayat percakapan tersimpan
- **Chat Bubbles**: UI chat yang modern dan user-friendly
- **Tutorial**: Panduan penggunaan chat untuk user baru

### 🗳️ Polling System
- **Create Polls**: Admin dapat membuat polling baru
- **Vote**: User dapat memberikan suara pada polling aktif
- **Poll Management**: CRUD operations untuk polling
- **Poll Statistics**: Visualisasi hasil polling dengan chart
- **Poll Status**: Active/inactive poll management

### 📋 Policy Management
- **Policy CRUD**: Create, read, update, delete kebijakan
- **Policy Categories**: Kategorisasi kebijakan
- **Policy Search**: Pencarian kebijakan berdasarkan kategori
- **Policy Details**: Tampilan detail kebijakan lengkap

### 📊 Reporting System
- **Submit Reports**: User dapat mengirim laporan
- **Report Categories**: Kategorisasi laporan (infrastruktur, layanan, dll)
- **Report Status**: Pending, in progress, resolved
- **Report Priority**: Low, medium, high priority
- **Admin Management**: Admin dapat mengelola dan merespons laporan
- **Report Statistics**: Dashboard statistik laporan

### 👥 User Management (Admin)
- **User CRUD**: Manajemen user lengkap
- **NIK Verification**: Verifikasi NIK user
- **User Statistics**: Statistik user dan verifikasi
- **Role Management**: Pengaturan role user

### 📈 Admin Dashboard
- **Statistics Overview**: Ringkasan statistik aplikasi
- **User Analytics**: Analisis data user
- **Poll Analytics**: Analisis data polling
- **Report Analytics**: Analisis data laporan
- **Chart Visualizations**: Grafik dan visualisasi data

### ⚙️ Settings & Profile
- **Profile Management**: Edit profil user
- **Settings Page**: Pengaturan aplikasi
- **Credits Page**: Informasi pengembang
- **Responsive Design**: UI yang responsif di semua device

## 🌐 API Endpoints

### Authentication
- `POST /api/register` - Registrasi user baru
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user
- `GET /api/profile` - Get user profile (protected)
- `PUT /api/profile` - Update user profile (protected)

### Admin Authentication
- `POST /api/admin/login` - Login admin
- `GET /api/admin/users` - Get all users (admin only)
- `POST /api/admin/users` - Create new user (admin only)
- `PUT /api/admin/users/<id>` - Update user (admin only)
- `DELETE /api/admin/users/<id>` - Delete user (admin only)

### Polling
- `GET /api/polls` - Get all polls
- `POST /api/polls` - Create new poll (admin only)
- `PUT /api/polls/<id>` - Update poll (admin only)
- `DELETE /api/polls/<id>` - Delete poll (admin only)
- `POST /api/polls/<id>/vote` - Vote on poll (protected)
- `GET /api/polls/<id>/results` - Get poll results

### Policies
- `GET /api/policies` - Get all policies
- `GET /api/policies/<id>` - Get specific policy
- `POST /api/policies` - Create new policy (admin only)
- `PUT /api/policies/<id>` - Update policy (admin only)
- `DELETE /api/policies/<id>` - Delete policy (admin only)

### Reports
- `GET /api/reports` - Get all reports (admin only)
- `POST /api/reports` - Submit new report (protected)
- `PUT /api/reports/<id>` - Update report status (admin only)
- `DELETE /api/reports/<id>` - Delete report (admin only)
- `GET /api/reports/stats` - Get report statistics (admin only)

### Health Check
- `GET /api/health` - Status aplikasi

## 🗄️ Database Schema

### User Table
```sql
CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(80) UNIQUE NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'konsituen',
    description TEXT,
    password_hash VARCHAR(255) NOT NULL,
    nik VARCHAR(16),
    nik_verified BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Poll Table
```sql
CREATE TABLE poll (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active',
    end_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Poll Option Table
```sql
CREATE TABLE poll_option (
    id INT PRIMARY KEY AUTO_INCREMENT,
    poll_id INT NOT NULL,
    option_text VARCHAR(255) NOT NULL,
    vote_count INT DEFAULT 0,
    FOREIGN KEY (poll_id) REFERENCES poll(id) ON DELETE CASCADE
);
```

### Poll Vote Table
```sql
CREATE TABLE poll_vote (
    id INT PRIMARY KEY AUTO_INCREMENT,
    poll_id INT NOT NULL,
    user_id INT NOT NULL,
    option_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (poll_id) REFERENCES poll(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (option_id) REFERENCES poll_option(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_poll (user_id, poll_id)
);
```

### Policy Table
```sql
CREATE TABLE policy (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    category VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Report Table
```sql
CREATE TABLE report (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100),
    location VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'medium',
    admin_notes TEXT,
    resolver_id INT,
    resolved_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (resolver_id) REFERENCES user(id)
);
```

## 🔒 Keamanan

- **Password Hashing**: Menggunakan Werkzeug untuk hash password
- **JWT Authentication**: Token-based authentication dengan expiration
- **CORS Protection**: Konfigurasi CORS untuk frontend domain
- **Input Validation**: Validasi form di frontend dan backend

## 🚀 Deployment

### Production Checklist

#### Backend Deployment
- [ ] Ubah `JWT_SECRET_KEY` di production (gunakan key yang kuat)
- [ ] Set `FLASK_ENV=production`
- [ ] Gunakan production database (bukan localhost)
- [ ] Konfigurasi CORS untuk production domain
- [ ] Setup HTTPS dengan SSL certificate
- [ ] Konfigurasi web server (Nginx/Apache)
- [ ] Setup process manager (PM2, Supervisor)
- [ ] Monitoring dan logging
- [ ] Backup database secara berkala

#### Frontend Deployment
- [ ] Build production version: `npm run build`
- [ ] Deploy ke hosting (Vercel, Netlify, atau server)
- [ ] Update API base URL untuk production
- [ ] Setup CDN untuk assets
- [ ] Konfigurasi domain dan DNS

#### Environment Variables Production
```env
# Production Backend .env
FLASK_ENV=production
FLASK_DEBUG=False
JWT_SECRET_KEY=your-super-secure-production-key
DATABASE_URL=mysql+pymysql://user:password@production-host:3306/smartpol_chatbot
CORS_ORIGINS=https://yourdomain.com
```

### Docker Deployment (Optional)

**Dockerfile untuk Backend:**
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]
```

**Dockerfile untuk Frontend:**
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

**Docker Compose:**
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=mysql+pymysql://root:password@db:3306/smartpol_chatbot
    depends_on:
      - db
  
  frontend:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - backend
  
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: smartpol_chatbot
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

### Development Guidelines

- Gunakan ESLint dan Prettier untuk code formatting
- Tulis unit tests untuk fitur baru
- Update dokumentasi jika diperlukan
- Follow conventional commits untuk commit messages
- Test semua fitur sebelum submit PR

## 📊 Project Status

### Completed Features ✅
- [x] User Authentication & Registration
- [x] Admin Authentication & Dashboard
- [x] **Role-based Access Control** dengan validasi ketat
- [x] **Authentication Testing Scripts** untuk validasi sistem
- [x] Chat System dengan UI yang responsif
- [x] Polling System dengan voting
- [x] Policy Management
- [x] Report System dengan status tracking
- [x] User Management (Admin)
- [x] NIK Verification
- [x] Statistics Dashboard
- [x] Responsive Design
- [x] Protected Routes
- [x] Database Migration Support
- [x] **Test User Creation Scripts** untuk development
- [x] **Syntax Error Fixes** untuk semua komponen admin
- [x] **Comprehensive Error Handling** dengan pesan yang jelas

### Recent Updates & Fixes 🔧

**Authentication & Security Improvements:**
- ✅ Implementasi role-based access control yang ketat
- ✅ Validasi role untuk mencegah akses unauthorized
- ✅ Pesan error yang informatif untuk role tidak valid
- ✅ Script testing untuk validasi sistem autentikasi
- ✅ Pemisahan portal admin dan user yang jelas

**Bug Fixes & Code Quality:**
- ✅ Perbaikan syntax error di semua komponen admin
- ✅ Fix malformed JSX dan TypeScript errors
- ✅ **Fixed deprecated Tabs.TabPane warning** di MonthlyReport.jsx
- ✅ **Fixed TypeError 'Cannot read properties of null'** di ErrorBoundary.jsx
- ✅ **Fixed 'activitiesData.map is not a function' error** di ReportPolling.jsx
- ✅ Implementasi fallback data untuk komponen report
- ✅ Perbaikan struktur data dan konsistensi API
- ✅ Optimisasi error handling di seluruh aplikasi
- ✅ **Enhanced null checks dan array validation** untuk mencegah runtime errors

**Development Tools:**
- ✅ Script otomatis untuk setup development environment
- ✅ Test user creation dengan berbagai role
- ✅ Database validation dan migration tools
- ✅ Comprehensive testing scripts

### Future Enhancements 🚀
- [ ] Real-time notifications
- [ ] Email notifications
- [ ] File upload untuk reports
- [ ] Advanced analytics
- [ ] Mobile app (React Native)
- [ ] API rate limiting
- [ ] Advanced search functionality
- [ ] Multi-language support

## 📞 Support

Jika mengalami masalah atau butuh bantuan:

1. **Check Documentation**: Baca dokumentasi ini dengan teliti
2. **Search Issues**: Cek existing issues di repository
3. **Create Issue**: Buat issue baru dengan detail yang lengkap
4. **Contact**: Hubungi tim pengembang

## 📝 License

Project ini menggunakan MIT License. Lihat file `LICENSE` untuk detail lengkap.

## 👥 Tim Pengembang

### Tech Stack
- **Frontend**: React.js + Vite + Ant Design + Tailwind CSS
- **Backend**: Flask + SQLAlchemy + MySQL
- **Authentication**: JWT-based system
- **Charts**: Chart.js untuk visualisasi data
- **Deployment**: Docker support + Traditional hosting

### Architecture
- **Frontend**: Single Page Application (SPA)
- **Backend**: RESTful API
- **Database**: Relational database dengan foreign keys
- **Security**: Password hashing, JWT tokens, CORS protection

## 🙏 Acknowledgments

- Ant Design untuk UI components yang excellent
- Flask community untuk framework yang powerful
- React.js team untuk library yang amazing
- MySQL untuk database yang reliable

---

**SmartPol Chatbot** - Menghubungkan politik dengan teknologi untuk pelayanan yang lebih baik.

*Dibuat dengan ❤️ untuk meningkatkan partisipasi politik dan transparansi pemerintahan.*
