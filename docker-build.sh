#!/usr/bin/env bash
set -e

echo "==================================================="
echo "Razorpay Distributed System - Docker Image Builder"
echo "==================================================="

echo "Step 1: Building Java Microservices JARs..."
mvn clean package -DskipTests

echo "Step 2: Building Service Registry Image..."
docker build -f docker/Dockerfile.service --build-arg SERVICE_NAME=service-registry -t razorpay/service-registry:latest .

echo "Step 3: Building Config Server Image..."
docker build -f docker/Dockerfile.service --build-arg SERVICE_NAME=config-server -t razorpay/config-server:latest .

echo "Step 4: Building API Gateway Image..."
docker build -f docker/Dockerfile.service --build-arg SERVICE_NAME=api-gateway -t razorpay/api-gateway:latest .

echo "Step 5: Building Core Microservices Images..."
docker build -f docker/Dockerfile.service --build-arg SERVICE_NAME=user-service -t razorpay/user-service:latest .
docker build -f docker/Dockerfile.service --build-arg SERVICE_NAME=merchant-service -t razorpay/merchant-service:latest .
docker build -f docker/Dockerfile.service --build-arg SERVICE_NAME=payment-service -t razorpay/payment-service:latest .
docker build -f docker/Dockerfile.service --build-arg SERVICE_NAME=wallet-service -t razorpay/wallet-service:latest .
docker build -f docker/Dockerfile.service --build-arg SERVICE_NAME=transaction-service -t razorpay/transaction-service:latest .
docker build -f docker/Dockerfile.service --build-arg SERVICE_NAME=settlement-service -t razorpay/settlement-service:latest .
docker build -f docker/Dockerfile.service --build-arg SERVICE_NAME=notification-service -t razorpay/notification-service:latest .
docker build -f docker/Dockerfile.service --build-arg SERVICE_NAME=ai-assistant-service -t razorpay/ai-assistant-service:latest .

echo "Step 6: Building React Frontend Image..."
docker build -f docker/Dockerfile.frontend -t razorpay/frontend:latest .

echo "==================================================="
echo "All Docker images have been successfully built!"
echo "==================================================="
