# MySQL MCP Server - IDE Fix Script (PowerShell)
# This script sets MySQL environment variables permanently for Windows user

Write-Host '========================================' -ForegroundColor Cyan
Write-Host '  MySQL MCP Server - IDE Fix Script' -ForegroundColor Cyan
Write-Host '========================================' -ForegroundColor Cyan
Write-Host ''
Write-Host 'This script will set MySQL environment variables' -ForegroundColor Yellow
Write-Host 'permanently for your Windows user account.' -ForegroundColor Yellow
Write-Host ''
Write-Host 'After running this script, you MUST:' -ForegroundColor Red
Write-Host '1. Close your IDE completely' -ForegroundColor Red
Write-Host '2. Restart your IDE' -ForegroundColor Red
Write-Host '3. Then try using MySQL MCP server again' -ForegroundColor Red
Write-Host ''
Read-Host 'Press Enter to continue'
Write-Host ''
Write-Host 'Setting environment variables...' -ForegroundColor Green
Write-Host ''

# Set permanent environment variables for current user
try {
    [Environment]::SetEnvironmentVariable('MYSQL_HOST', 'localhost', 'User')
    Write-Host 'MYSQL_HOST set to localhost' -ForegroundColor Green
} catch {
    Write-Host 'Failed to set MYSQL_HOST' -ForegroundColor Red
}

try {
    [Environment]::SetEnvironmentVariable('MYSQL_PORT', '3306', 'User')
    Write-Host 'MYSQL_PORT set to 3306' -ForegroundColor Green
} catch {
    Write-Host 'Failed to set MYSQL_PORT' -ForegroundColor Red
}

try {
    [Environment]::SetEnvironmentVariable('MYSQL_USER', 'root', 'User')
    Write-Host 'MYSQL_USER set to root' -ForegroundColor Green
} catch {
    Write-Host 'Failed to set MYSQL_USER' -ForegroundColor Red
}

try {
    [Environment]::SetEnvironmentVariable('MYSQL_PASSWORD', 'EMPTY', 'User')
    Write-Host 'MYSQL_PASSWORD set to EMPTY (for Laragon)' -ForegroundColor Green
} catch {
    Write-Host 'Failed to set MYSQL_PASSWORD' -ForegroundColor Red
}

try {
    [Environment]::SetEnvironmentVariable('MYSQL_DATABASE', 'smartpol_chatbot', 'User')
    Write-Host 'MYSQL_DATABASE set to smartpol_chatbot' -ForegroundColor Green
} catch {
    Write-Host 'Failed to set MYSQL_DATABASE' -ForegroundColor Red
}

Write-Host ''
Write-Host '========================================' -ForegroundColor Cyan
Write-Host '          IMPORTANT NEXT STEPS' -ForegroundColor Cyan
Write-Host '========================================' -ForegroundColor Cyan
Write-Host ''
Write-Host '1. CLOSE your IDE/Editor completely' -ForegroundColor Yellow
Write-Host '2. RESTART your IDE/Editor' -ForegroundColor Yellow
Write-Host '3. Go to MCP settings in your IDE' -ForegroundColor Yellow
Write-Host '4. Try to start MySQL MCP server again' -ForegroundColor Yellow
Write-Host ''
Write-Host 'The environment variables are now set permanently' -ForegroundColor Green
Write-Host 'for your Windows user account.' -ForegroundColor Green
Write-Host ''
Write-Host 'If you still get errors after restarting:' -ForegroundColor Yellow
Write-Host '- Make sure Laragon is running' -ForegroundColor Yellow
Write-Host '- Check that MySQL service is started' -ForegroundColor Yellow
Write-Host '- Verify database smartpol_chatbot exists' -ForegroundColor Yellow
Write-Host ''
Write-Host '========================================' -ForegroundColor Cyan
Write-Host ''
Read-Host 'Press Enter to exit'