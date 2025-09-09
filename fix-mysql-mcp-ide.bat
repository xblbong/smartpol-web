@echo off
echo ========================================
echo   MySQL MCP Server - IDE Fix Script
echo ========================================
echo.
echo This script will set MySQL environment variables
echo permanently for your Windows user account.
echo.
echo After running this script, you MUST:
echo 1. Close your IDE completely
echo 2. Restart your IDE
echo 3. Then try using MySQL MCP server again
echo.
pause
echo.
echo Setting environment variables...
echo.

REM Set permanent environment variables for current user
setx MYSQL_HOST "localhost" >nul
if %errorlevel% equ 0 (
    echo ✓ MYSQL_HOST set to localhost
) else (
    echo ✗ Failed to set MYSQL_HOST
)

setx MYSQL_PORT "3306" >nul
if %errorlevel% equ 0 (
    echo ✓ MYSQL_PORT set to 3306
) else (
    echo ✗ Failed to set MYSQL_PORT
)

setx MYSQL_USER "root" >nul
if %errorlevel% equ 0 (
    echo ✓ MYSQL_USER set to root
) else (
    echo ✗ Failed to set MYSQL_USER
)

setx MYSQL_PASSWORD "EMPTY" >nul
if %errorlevel% equ 0 (
    echo ✓ MYSQL_PASSWORD set to EMPTY (for Laragon)
) else (
    echo ✗ Failed to set MYSQL_PASSWORD
)

setx MYSQL_DATABASE "smartpol_chatbot" >nul
if %errorlevel% equ 0 (
    echo ✓ MYSQL_DATABASE set to smartpol_chatbot
) else (
    echo ✗ Failed to set MYSQL_DATABASE
)

echo.
echo ========================================
echo           IMPORTANT NEXT STEPS
echo ========================================
echo.
echo 1. CLOSE your IDE/Editor completely
echo 2. RESTART your IDE/Editor
echo 3. Go to MCP settings in your IDE
echo 4. Try to start MySQL MCP server again
echo.
echo The environment variables are now set permanently
echo for your Windows user account.
echo.
echo If you still get errors after restarting:
echo - Make sure Laragon is running
echo - Check that MySQL service is started
echo - Run test-mysql-connection.py to verify
echo.
echo ========================================
echo.
pause