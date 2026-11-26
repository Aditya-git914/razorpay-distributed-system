@echo off
echo ===================================================
echo Razorpay Platform - Local Microservices Launcher
echo ===================================================
echo.

REM Verify target JARs exist
if not exist service-registry\target\service-registry-1.0.0.jar (
    echo Building microservices JARs first...
    call mvn clean package -DskipTests
    if %ERRORLEVEL% neq 0 (
        echo Maven build failed!
        exit /b %ERRORLEVEL%
    )
)

echo [1/4] Starting Service Registry (Eureka on :8761)...
start "Eureka [8761]" cmd /k "title Eureka Registry [8761] && java -jar service-registry\target\service-registry-1.0.0.jar"
echo Waiting 8 seconds for Eureka initialization...
timeout /t 8 /nobreak >nul

echo [2/4] Starting API Gateway (:8080)...
start "API Gateway [8080]" cmd /k "title API Gateway [8080] && java -jar api-gateway\target\api-gateway-1.0.0.jar"
echo Waiting 5 seconds for Gateway initialization...
timeout /t 5 /nobreak >nul

echo [3/4] Launching Core Microservices...
start "User Service [8081]" cmd /k "title User Service [8081] && java -jar user-service\target\user-service-1.0.0.jar"
start "Merchant Service [8082]" cmd /k "title Merchant Service [8082] && java -jar merchant-service\target\merchant-service-1.0.0.jar"
start "Payment Service [8083]" cmd /k "title Payment Service [8083] && java -jar payment-service\target\payment-service-1.0.0.jar"
start "Wallet Service [8084]" cmd /k "title Wallet Service [8084] && java -jar wallet-service\target\wallet-service-1.0.0.jar"
start "Transaction Service [8085]" cmd /k "title Transaction Service [8085] && java -jar transaction-service\target\transaction-service-1.0.0.jar"
start "Settlement Service [8086]" cmd /k "title Settlement Service [8086] && java -jar settlement-service\target\settlement-service-1.0.0.jar"
start "Notification Service [8087]" cmd /k "title Notification Service [8087] && java -jar notification-service\target\notification-service-1.0.0.jar"
start "AI Assistant [8088]" cmd /k "title AI Assistant [8088] && java -jar ai-assistant-service\target\ai-assistant-service-1.0.0.jar"

echo [4/4] Starting React Merchant Dashboard (:3000)...
cd razorpay-frontend
start "Frontend Dashboard [3000]" cmd /k "title Frontend Dashboard [3000] && npm.cmd run dev"
cd ..

echo.
echo ===================================================
echo All services launched!
echo - Merchant Dashboard: http://localhost:3000
echo - API Gateway:        http://localhost:8080
echo - Eureka Registry:    http://localhost:8761
echo ===================================================
