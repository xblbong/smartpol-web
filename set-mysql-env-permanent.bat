@echo off
echo Setting MySQL MCP Server environment variables permanently...
echo.

REM Set environment variables permanently for current user
setx MYSQL_HOST "localhost"
setx MYSQL_PORT "3306"
setx MYSQL_USER "root"
setx MYSQL_PASSWORD ""
setx MYSQL_DATABASE "smartpol_chatbot"

echo.
echo ✅ Environment variables set permanently!
echo.
echo Variables set:
echo   MYSQL_HOST=localhost
echo   MYSQL_PORT=3306
echo   MYSQL_USER=root
echo   MYSQL_PASSWORD=(empty)
echo   MYSQL_DATABASE=smartpol_chatbot
echo.
echo ⚠️  IMPORTANT: You need to restart your IDE/application for the changes to take effect!
echo.
echo After restarting, you can run: mysql_mcp_server
echo.
pause