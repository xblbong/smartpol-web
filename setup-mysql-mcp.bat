@echo off
echo Setting up MySQL MCP Server Environment Variables...
echo.

REM Default values for Laragon setup
set DEFAULT_HOST=localhost
set DEFAULT_PORT=3306
set DEFAULT_USER=root
set DEFAULT_PASSWORD=
set DEFAULT_DATABASE=smartpol_chatbot

echo Enter MySQL configuration (press Enter for default values):
echo.

set /p MYSQL_HOST="MySQL Host [%DEFAULT_HOST%]: "
if "%MYSQL_HOST%"=="" set MYSQL_HOST=%DEFAULT_HOST%

set /p MYSQL_PORT="MySQL Port [%DEFAULT_PORT%]: "
if "%MYSQL_PORT%"=="" set MYSQL_PORT=%DEFAULT_PORT%

set /p MYSQL_USER="MySQL User [%DEFAULT_USER%]: "
if "%MYSQL_USER%"=="" set MYSQL_USER=%DEFAULT_USER%

set /p MYSQL_PASSWORD="MySQL Password [%DEFAULT_PASSWORD%]: "
if "%MYSQL_PASSWORD%"=="" set MYSQL_PASSWORD=%DEFAULT_PASSWORD%

set /p MYSQL_DATABASE="MySQL Database [%DEFAULT_DATABASE%]: "
if "%MYSQL_DATABASE%"=="" set MYSQL_DATABASE=%DEFAULT_DATABASE%

echo.
echo Setting environment variables...

REM Set environment variables for current session
set MYSQL_HOST=%MYSQL_HOST%
set MYSQL_PORT=%MYSQL_PORT%
set MYSQL_USER=%MYSQL_USER%
set MYSQL_PASSWORD=%MYSQL_PASSWORD%
set MYSQL_DATABASE=%MYSQL_DATABASE%

REM Set environment variables permanently
setx MYSQL_HOST "%MYSQL_HOST%"
setx MYSQL_PORT "%MYSQL_PORT%"
setx MYSQL_USER "%MYSQL_USER%"
setx MYSQL_PASSWORD "%MYSQL_PASSWORD%"
setx MYSQL_DATABASE "%MYSQL_DATABASE%"

echo.
echo Environment variables set successfully!
echo Current configuration:
echo   MYSQL_HOST: %MYSQL_HOST%
echo   MYSQL_PORT: %MYSQL_PORT%
echo   MYSQL_USER: %MYSQL_USER%
echo   MYSQL_PASSWORD: [HIDDEN]
echo   MYSQL_DATABASE: %MYSQL_DATABASE%

echo.
echo You can now start the MySQL MCP server with:
echo mysql_mcp_server

echo.
echo Note: You may need to restart your terminal/IDE for the changes to take effect.
pause