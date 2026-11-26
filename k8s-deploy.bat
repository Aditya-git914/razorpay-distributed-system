@echo off
echo ===================================================
echo Razorpay Distributed System - Kubernetes Deployment
echo ===================================================

echo Applying 00-namespace.yml...
kubectl apply -f k8s/00-namespace.yml

echo Applying 01-configmaps-secrets.yml...
kubectl apply -f k8s/01-configmaps-secrets.yml

echo Applying 02-databases.yml (PostgreSQL + Redis)...
kubectl apply -f k8s/02-databases.yml

echo Applying 03-kafka.yml (Zookeeper + Kafka Broker)...
kubectl apply -f k8s/03-kafka.yml

echo Applying 04-service-registry.yml (Eureka Discovery)...
kubectl apply -f k8s/04-service-registry.yml

echo Applying 05-api-gateway.yml (Edge Routing)...
kubectl apply -f k8s/05-api-gateway.yml

echo Applying 06-microservices.yml (All 9 Core Services)...
kubectl apply -f k8s/06-microservices.yml

echo Applying 07-ingress.yml (Ingress Controller Rules)...
kubectl apply -f k8s/07-ingress.yml

echo Applying 08-frontend.yml (React Dashboard)...
kubectl apply -f k8s/08-frontend.yml

echo.
echo ===================================================
echo Kubernetes deployment applied! Checking status:
echo ===================================================
kubectl get pods,svc,hpa -n razorpay-system
