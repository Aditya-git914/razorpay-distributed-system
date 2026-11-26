#!/usr/bin/env bash
set -e

echo "==================================================="
echo "Razorpay Platform - Local Microservices Launcher"
echo "==================================================="

# Verify target JARs exist
if [ ! -f "service-registry/target/service-registry-1.0.0.jar" ]; then
    echo "Building microservices JARs first..."
    mvn clean package -DskipTests
fi

echo "[1/4] Starting Service Registry (Eureka on :8761)..."
nohup java -jar service-registry/target/service-registry-1.0.0.jar > logs-eureka.log 2>&1 &
echo $! > .pids
sleep 8

echo "[2/4] Starting API Gateway (:8080)..."
nohup java -jar api-gateway/target/api-gateway-1.0.0.jar > logs-gateway.log 2>&1 &
echo $! >> .pids
sleep 5

echo "[3/4] Launching Core Microservices..."
nohup java -jar user-service/target/user-service-1.0.0.jar > logs-user.log 2>&1 &
echo $! >> .pids
nohup java -jar merchant-service/target/merchant-service-1.0.0.jar > logs-merchant.log 2>&1 &
echo $! >> .pids
nohup java -jar payment-service/target/payment-service-1.0.0.jar > logs-payment.log 2>&1 &
echo $! >> .pids
nohup java -jar wallet-service/target/wallet-service-1.0.0.jar > logs-wallet.log 2>&1 &
echo $! >> .pids
nohup java -jar transaction-service/target/transaction-service-1.0.0.jar > logs-transaction.log 2>&1 &
echo $! >> .pids
nohup java -jar settlement-service/target/settlement-service-1.0.0.jar > logs-settlement.log 2>&1 &
echo $! >> .pids
nohup java -jar notification-service/target/notification-service-1.0.0.jar > logs-notification.log 2>&1 &
echo $! >> .pids
nohup java -jar ai-assistant-service/target/ai-assistant-service-1.0.0.jar > logs-ai.log 2>&1 &
echo $! >> .pids

echo "[4/4] Starting React Merchant Dashboard (:3000)..."
(cd razorpay-frontend && npm run dev) &
echo $! >> .pids

echo "==================================================="
echo "All services launched in background!"
echo "- Merchant Dashboard: http://localhost:3000"
echo "- API Gateway:        http://localhost:8080"
echo "- Eureka Registry:    http://localhost:8761"
echo "To stop all services run: ./stop-local.sh"
echo "==================================================="
