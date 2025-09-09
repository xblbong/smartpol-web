# Verify MySQL Environment Variables Script
# This script checks if MySQL environment variables are properly set

Write-Host '========================================' -ForegroundColor Cyan
Write-Host '  MySQL Environment Variables Check' -ForegroundColor Cyan
Write-Host '========================================' -ForegroundColor Cyan
Write-Host ''

# Check current environment variables
Write-Host 'Checking current environment variables...' -ForegroundColor Yellow
Write-Host ''

$mysqlVars = @('MYSQL_HOST', 'MYSQL_PORT', 'MYSQL_USER', 'MYSQL_PASSWORD', 'MYSQL_DATABASE')
$allSet = $true

foreach ($var in $mysqlVars) {
    $value = [Environment]::GetEnvironmentVariable($var, 'User')
    if ($value) {
        Write-Host "[OK] $var = $value" -ForegroundColor Green
    } else {
        Write-Host "[MISSING] $var is NOT SET" -ForegroundColor Red
        $allSet = $false
    }
}

Write-Host ''

if ($allSet) {
    Write-Host 'All MySQL environment variables are set correctly!' -ForegroundColor Green
    Write-Host ''
    Write-Host 'If you still get errors in IDE MCP settings:' -ForegroundColor Yellow
    Write-Host '1. Make sure you have COMPLETELY CLOSED your IDE' -ForegroundColor Red
    Write-Host '2. RESTART your IDE (not just reload)' -ForegroundColor Red
    Write-Host '3. Try MySQL MCP server again' -ForegroundColor Yellow
    Write-Host ''
    Write-Host 'Environment variables are only loaded when IDE starts!' -ForegroundColor Cyan
} else {
    Write-Host 'Some environment variables are missing!' -ForegroundColor Red
    Write-Host 'Running fix script to set them...' -ForegroundColor Yellow
    Write-Host ''
    
    # Set the missing variables
    [Environment]::SetEnvironmentVariable('MYSQL_HOST', 'localhost', 'User')
    [Environment]::SetEnvironmentVariable('MYSQL_PORT', '3306', 'User')
    [Environment]::SetEnvironmentVariable('MYSQL_USER', 'root', 'User')
    [Environment]::SetEnvironmentVariable('MYSQL_PASSWORD', 'EMPTY', 'User')
    [Environment]::SetEnvironmentVariable('MYSQL_DATABASE', 'smartpol_chatbot', 'User')
    
    Write-Host 'Environment variables have been set!' -ForegroundColor Green
    Write-Host ''
    Write-Host 'IMPORTANT: You MUST restart your IDE now!' -ForegroundColor Red
}

Write-Host ''
Write-Host '========================================' -ForegroundColor Cyan
Read-Host 'Press Enter to exit'