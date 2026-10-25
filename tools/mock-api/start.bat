@echo off
chcp 65001 >nul
echo ========================================
echo  CommuteMatch Mock API (json-server)
echo ========================================
echo.
echo Lan dau chay: tu dong "npm install" neu chua co node_modules.
echo Server: http://localhost:3000  (du lieu luu trong db.json)
echo Dat lai du lieu mau: npm run reset
echo Bat tren trang web (Console F12): MockApi.dungMayChu("http://localhost:3000")
echo.
echo Nhan Ctrl+C de dung server
echo ========================================
echo.

cd /d "%~dp0"
if not exist node_modules call npm install
npm start

