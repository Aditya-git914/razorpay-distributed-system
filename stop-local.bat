@echo off
echo ===================================================
echo Stopping Razorpay Local Microservices...
echo ===================================================

taskkill /F /FI "WINDOWTITLE eq Eureka Registry [8761]*" /T 2>nul
taskkill /F /FI "WINDOWTITLE eq API Gateway [8080]*" /T 2>nul
taskkill /F /FI "WINDOWTITLE eq User Service [8081]*" /T 2>nul
taskkill /F /FI "WINDOWTITLE eq Merchant Service [8082]*" /T 2>nul
taskkill /F /FI "WINDOWTITLE eq Payment Service [8083]*" /T 2>nul
taskkill /F /FI "WINDOWTITLE eq Wallet Service [8084]*" /T 2>nul
taskkill /F /FI "WINDOWTITLE eq Transaction Service [8085]*" /T 2>nul
taskkill /F /FI "WINDOWTITLE eq Settlement Service [8086]*" /T 2>nul
taskkill /F /FI "WINDOWTITLE eq Notification Service [8087]*" /T 2>nul
taskkill /F /FI "WINDOWTITLE eq AI Assistant [8088]*" /T 2>nul
taskkill /F /FI "WINDOWTITLE eq Frontend Dashboard [3000]*" /T 2>nul

echo All local services stopped.
