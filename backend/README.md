# SmartPol Backend API

Backend API untuk aplikasi SmartPol menggunakan Flask.

## Fitur

- Autentikasi pengguna (Register, Login, Logout)
- JWT Token untuk keamanan
- Database SQLite dengan SQLAlchemy
- CORS support untuk frontend
- Validasi data input

## Instalasi

1. Pastikan Python 3.8+ terinstall
2. Buat virtual environment:
   ```bash
   python -m venv venv
   ```

3. Aktifkan virtual environment:
   - Windows: `venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Copy file .env dan sesuaikan konfigurasi jika diperlukan

## Menjalankan Server

```bash
python app.py
```

Server akan berjalan di `http://localhost:5000`

## API Endpoints

### Health Check
- **GET** `/api/health` - Cek status server

### Authentication
- **POST** `/api/register` - Registrasi pengguna baru
- **POST** `/api/login` - Login pengguna
- **POST** `/api/logout` - Logout pengguna (requires JWT)
- **GET** `/api/profile` - Get profile pengguna (requires JWT)

### Request Format

#### Register
```json
{
  "username": "string",
  "fullName": "string",
  "email": "string",
  "password": "string",
  "role": "konsituen",
  "description": "string (optional)"
}
```

#### Login
```json
{
  "username": "string",
  "password": "string"
}
```

## Database

Menggunakan SQLite dengan tabel `User` yang memiliki field:
- id (Primary Key)
- username (Unique)
- full_name
- email (Unique)
- password_hash
- role (default: 'konsituen')
- description
- created_at
- is_active

## Security

- Password di-hash menggunakan Werkzeug
- JWT token untuk autentikasi
- CORS dikonfigurasi untuk frontend
- Validasi input data