# MySQL MCP Server Setup Guide

Panduan lengkap untuk menyiapkan MySQL MCP Server dengan konfigurasi yang benar.

## Error yang Anda Alami

```
Missing required database configuration. Please check environment variables:
MYSQL_USER, MYSQL_PASSWORD, and MYSQL_DATABASE are required
```

Error ini terjadi karena:
1. MySQL MCP server membutuhkan environment variables yang belum diset
2. IDE/Editor tidak dapat membaca environment variables yang diset di terminal
3. Environment variables belum diset secara permanen di sistem Windows

## Solusi

### 🚨 Solusi Cepat untuk IDE (Recommended)

Jika MySQL MCP server error di IDE/settings:

```cmd
fix-mysql-mcp-ide.bat
```

**PENTING:** Setelah menjalankan script di atas:
1. **Tutup IDE/Editor sepenuhnya**
2. **Restart IDE/Editor**
3. Coba jalankan MySQL MCP server lagi

### 1. Setup Otomatis

#### Untuk PowerShell:
```powershell
.\setup-mysql-mcp.ps1
```

#### Untuk Command Prompt:
```cmd
setup-mysql-mcp.bat
```

### 2. Setup Manual

#### Untuk PowerShell:
```powershell
$env:MYSQL_HOST="localhost"
$env:MYSQL_PORT="3306"
$env:MYSQL_USER="root"
$env:MYSQL_PASSWORD=""  # Kosong untuk Laragon
$env:MYSQL_DATABASE="smartpol_chatbot"
```

#### Untuk Command Prompt:
```cmd
set MYSQL_HOST=localhost
set MYSQL_PORT=3306
set MYSQL_USER=root
set MYSQL_PASSWORD=
set MYSQL_DATABASE=smartpol_chatbot
```

#### Untuk Environment Variables Permanent:
1. Buka **System Properties** → **Environment Variables**
2. Tambahkan variables berikut di **User variables**:
   - `MYSQL_HOST` = `localhost`
   - `MYSQL_PORT` = `3306`
   - `MYSQL_USER` = `root`
   - `MYSQL_PASSWORD` = (kosong untuk Laragon, atau password MySQL Anda)
   - `MYSQL_DATABASE` = `smartpol_chatbot`

## Konfigurasi untuk Laragon

Jika Anda menggunakan Laragon (yang umum untuk development lokal):

```
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=  (kosong)
MYSQL_DATABASE=smartpol_chatbot
```

## Testing Koneksi

Sebelum menjalankan MySQL MCP server, test koneksi terlebih dahulu:

```bash
python test-mysql-connection.py
```

Script ini akan:
- ✅ Memverifikasi semua environment variables sudah diset
- ✅ Test koneksi ke MySQL server
- ✅ Menampilkan informasi database
- ✅ Memberikan saran jika ada masalah

## Menjalankan MySQL MCP Server

Setelah environment variables diset dengan benar:

```bash
mysql_mcp_server
```

## Troubleshooting

### 1. "Missing required database configuration" di IDE
- **Penyebab**: IDE tidak dapat membaca environment variables
- **Solusi**: Jalankan `fix-mysql-mcp-ide.bat` dan restart IDE
- **Verifikasi**: Cek di Command Prompt dengan `echo %MYSQL_HOST%`

### 2. "Missing required database configuration" di Terminal
- **Solusi**: Set environment variables menggunakan script setup atau manual
- **Verifikasi**: Jalankan `test-mysql-connection.py`

### 3. "Access denied for user"
- **Solusi**: Periksa username dan password MySQL
- **Laragon**: Password biasanya kosong untuk user `root`

### 4. "Can't connect to MySQL server"
- **Solusi**: Pastikan MySQL server berjalan
- **Laragon**: Start Laragon dan pastikan MySQL service aktif

### 5. "Unknown database"
- **Solusi**: Buat database terlebih dahulu atau gunakan database yang sudah ada
- **Command**: `CREATE DATABASE smartpol_chatbot;`

### 6. Environment variables tidak terbaca setelah restart
- **Solusi**: Pastikan menggunakan `setx` untuk set permanent
- **Cek**: Buka Command Prompt baru dan jalankan `echo %MYSQL_HOST%`

## File yang Disediakan

1. **`fix-mysql-mcp-ide.bat`** - 🚨 **Script cepat untuk fix IDE** (jalankan ini dulu!)
2. **`set-mysql-env-permanent.bat`** - Set environment variables permanent
3. **`.env.mysql`** - Template environment variables
4. **`setup-mysql-mcp.ps1`** - Setup script untuk PowerShell
5. **`setup-mysql-mcp.bat`** - Setup script untuk Command Prompt
6. **`test-mysql-connection.py`** - Script untuk testing koneksi
7. **`MYSQL-MCP-SETUP.md`** - Dokumentasi lengkap (file ini)

## Langkah-langkah Lengkap

### Untuk Error di IDE/Settings:
1. **Pastikan Laragon berjalan** (atau MySQL service aktif)
2. **Jalankan** `fix-mysql-mcp-ide.bat`
3. **Tutup IDE sepenuhnya**
4. **Restart IDE**
5. **Coba MySQL MCP server lagi di settings**

### Untuk Setup Manual:
1. **Pastikan MySQL berjalan** (Laragon atau service MySQL)
2. **Jalankan setup script** (`setup-mysql-mcp.ps1` atau `setup-mysql-mcp.bat`)
3. **Test koneksi** dengan `python test-mysql-connection.py`
4. **Restart terminal/IDE** untuk memuat environment variables
5. **Jalankan MCP server** dengan `mysql_mcp_server`

## Catatan Penting

- Environment variables harus diset sebelum menjalankan MySQL MCP server
- Jika menggunakan IDE, restart IDE setelah setting environment variables
- Untuk production, gunakan user MySQL khusus (bukan root) dengan permissions terbatas
- Password sebaiknya tidak kosong untuk keamanan production

---

**Selamat! MySQL MCP Server Anda sekarang siap digunakan! 🎉**