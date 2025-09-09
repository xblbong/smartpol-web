# MySQL MCP Server Setup Script
# This script sets up environment variables for MySQL MCP Server

Write-Host "=== MySQL MCP Server Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if Laragon is running
$laraProcess = Get-Process -Name "laragon" -ErrorAction SilentlyContinue
if ($laraProcess) {
    Write-Host "✅ Laragon detected and running" -ForegroundColor Green
} else {
    Write-Host "⚠️  Laragon not detected. Make sure MySQL is running." -ForegroundColor Yellow
}

Write-Host ""

# Default values for Laragon
$defaultHost = "localhost"
$defaultPort = "3306"
$defaultUser = "root"
$defaultPassword = ""  # Empty for Laragon
$defaultDatabase = "smartpol_chatbot"

# Get user input with defaults
Write-Host "Enter MySQL configuration (press Enter for default values):" -ForegroundColor Blue
$mysqlHost = Read-Host "MySQL Host [$defaultHost]"
if ([string]::IsNullOrWhiteSpace($mysqlHost)) { $mysqlHost = $defaultHost }

$mysqlPort = Read-Host "MySQL Port [$defaultPort]"
if ([string]::IsNullOrWhiteSpace($mysqlPort)) { $mysqlPort = $defaultPort }

$mysqlUser = Read-Host "MySQL User [$defaultUser]"
if ([string]::IsNullOrWhiteSpace($mysqlUser)) { $mysqlUser = $defaultUser }

$mysqlPasswordSecure = Read-Host "MySQL Password (leave empty for Laragon)" -AsSecureString
$mysqlPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($mysqlPasswordSecure))
if ([string]::IsNullOrWhiteSpace($mysqlPasswordPlain)) { $mysqlPasswordPlain = $defaultPassword }

$mysqlDatabase = Read-Host "MySQL Database [$defaultDatabase]"
if ([string]::IsNullOrWhiteSpace($mysqlDatabase)) { $mysqlDatabase = $defaultDatabase }

Write-Host ""
Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  Host: $mysqlHost"
Write-Host "  Port: $mysqlPort"
Write-Host "  User: $mysqlUser"
Write-Host "  Password: $(if ($mysqlPasswordPlain -eq '') { '[EMPTY]' } else { '[SET]' })"
Write-Host "  Database: $mysqlDatabase"
Write-Host ""

# Set environment variables for current session
Write-Host "Setting environment variables for current session..." -ForegroundColor Blue
[Environment]::SetEnvironmentVariable('MYSQL_HOST', $mysqlHost, 'Process')
[Environment]::SetEnvironmentVariable('MYSQL_PORT', $mysqlPort, 'Process')
[Environment]::SetEnvironmentVariable('MYSQL_USER', $mysqlUser, 'Process')
# Use 'EMPTY' placeholder for empty password to ensure it gets passed to child processes
$passwordValue = if ($mysqlPasswordPlain -eq '') { 'EMPTY' } else { $mysqlPasswordPlain }
[Environment]::SetEnvironmentVariable('MYSQL_PASSWORD', $passwordValue, 'Process')
[Environment]::SetEnvironmentVariable('MYSQL_DATABASE', $mysqlDatabase, 'Process')

Write-Host "✅ Session environment variables set!" -ForegroundColor Green
Write-Host ""

# Set permanent environment variables (optional)
$setPermanent = Read-Host "Set permanent environment variables for your user account? (y/N)"
if ($setPermanent -eq 'y' -or $setPermanent -eq 'Y') {
    Write-Host "Setting permanent environment variables..." -ForegroundColor Blue
    [Environment]::SetEnvironmentVariable('MYSQL_HOST', $mysqlHost, 'User')
    [Environment]::SetEnvironmentVariable('MYSQL_PORT', $mysqlPort, 'User')
    [Environment]::SetEnvironmentVariable('MYSQL_USER', $mysqlUser, 'User')
    # For permanent variables, use actual empty string
    [Environment]::SetEnvironmentVariable('MYSQL_PASSWORD', $mysqlPasswordPlain, 'User')
    [Environment]::SetEnvironmentVariable('MYSQL_DATABASE', $mysqlDatabase, 'User')
    Write-Host "✅ Permanent environment variables set!" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: You need to restart your IDE/Terminal for permanent changes to take effect!" -ForegroundColor Red
    Write-Host ""
}

# Test connection
Write-Host "Testing MySQL connection..." -ForegroundColor Blue
try {
    python test-mysql-connection.py
} catch {
    Write-Host "❌ Could not run connection test. Make sure Python is installed and test-mysql-connection.py exists." -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host "1. If you set permanent variables, restart your IDE/Terminal" -ForegroundColor White
Write-Host "2. Make sure Laragon/MySQL is running" -ForegroundColor White
Write-Host "3. Run: mysql_mcp_server" -ForegroundColor White
Write-Host ""
Write-Host "For troubleshooting, see: MYSQL-MCP-SETUP.md" -ForegroundColor Gray
Write-Host ""

Read-Host "Press Enter to exit"