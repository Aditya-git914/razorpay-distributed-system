# 🚀 Step-by-Step Execution Guide: Razorpay Distributed Platform

A complete, production-grade guide to launching, testing, and managing the **Razorpay Distributed Microservices Platform**.

---

## 📑 Table of Contents
1. [Prerequisites Checklist](#1-prerequisites-checklist)
2. [Port Allocation & Architecture Summary](#2-port-allocation--architecture-summary)
3. [Method 1: Hybrid Local Run (Recommended for Dev & Testing)](#3-method-1-hybrid-local-run-recommended)
4. [Method 2: Full Docker Compose (All 16 Containers)](#4-method-2-full-docker-compose)
5. [Method 3: Kubernetes (K8s Cluster)](#5-method-3-kubernetes-deployment)
6. [Step-by-Step End-to-End API Walkthrough](#6-step-by-step-end-to-end-api-walkthrough)
7. [Troubleshooting & FAQ](#7-troubleshooting--faq)

---

## 1. Prerequisites Checklist

Before running the project, verify that your machine has the required tools installed:

| Tool | Minimum Version | Check Command |
| :--- | :--- | :--- |
| **Java JDK** | 21+ | `java -version` |
| **Apache Maven** | 3.9+ | `mvn -version` |
| **Node.js & npm** | 20+ / npm 10+ | `node -v` and `npm -v` |
| **Docker & Docker Compose** | Docker Desktop 4.20+ | `docker --version` and `docker compose version` |

Ensure **Docker Desktop** is open and running before proceeding.

---

## 2. Port Allocation & Architecture Summary

| Component | Port | Description |
| :--- | :---: | :--- |
| **Frontend Merchant Console** | `3000` | React 18 + Vite + Tailwind Dashboard & Simulator |
| **API Gateway** | `8080` | Spring Cloud Gateway (Edge JWT, Routing, Rate Limiter) |
| **Service Registry** | `8761` | Netflix Eureka Server Dashboard |
| **Config Server** | `8888` | Spring Cloud Config Server |
| **User Service** | `8081` | Authentication, JWT issuing, User KYC |
| **Merchant Service** | `8082` | Merchant onboarding, API keys, Webhooks |
| **Payment Service** | `8083` | Order creation, Idempotent payment processing, Refunds |
| **Wallet Service** | `8084` | Merchant balance ledger, Credits & Debits |
| **Transaction Service** | `8085` | Double-entry journal records, revenue aggregation |
| **Settlement Service** | `8086` | Automated T+1 settlement batches, instant payouts |
| **Notification Service** | `8087` | WebSocket alerts, webhook dispatchers |
| **AI Assistant Service** | `8088` | Fraud scoring heuristics, Copilot chat & insights |
| **PostgreSQL** | `5432` | Relational database (6 dedicated isolated databases) |
| **Redis** | `6379` | Distributed locks, Idempotency keys, Token bucket |
| **Apache Kafka** | `9092` / `29092` | Event bus (`payment-events`, `wallet-events`, etc.) |
| **Zookeeper** | `2181` | Kafka cluster coordination |
| **Zipkin** | `9411` | Distributed telemetry & tracing |

---

## 3. Method 1: Hybrid Local Run (Recommended)

In this mode, backing infrastructure (Databases, Redis, Kafka) runs in Docker, while Java microservices and the Vite frontend run directly on your host machine for fast startup and interactive terminal logs.

### Step 1: Start Backing Infrastructure Containers
Open PowerShell or your terminal in the project root:
```powershell
docker compose -f docker-compose.infra.yml up -d
```
*Wait ~10 seconds for PostgreSQL and Kafka to finish health checks.*

You can verify infrastructure status anytime with:
```powershell
docker compose -f docker-compose.infra.yml ps
```

---

### Step 2: Launch All Microservices & Frontend

#### Windows (1-Click):
Run the provided launcher script:
```powershell
.\run-local.bat
```

#### Linux / macOS (1-Click):
```bash
chmod +x run-local.sh stop-local.sh
./run-local.sh
```

---

### Step 3: Manual Startup Alternative (If you prefer running individual terminals)

If you wish to debug or start services individually:

1. **Build all JAR files**:
   ```powershell
   mvn clean package -DskipTests
   ```

2. **Start Service Registry (Must be started first)**:
   ```powershell
   # Terminal 1
   java -jar service-registry/target/service-registry-1.0.0.jar
   ```
   *Wait until Eureka starts on port `8761` (check http://localhost:8761).*

3. **Start API Gateway**:
   ```powershell
   # Terminal 2
   java -jar api-gateway/target/api-gateway-1.0.0.jar
   ```

4. **Start Core Microservices**:
   ```powershell
   # Open separate terminals for the services you wish to run:
   java -jar user-service/target/user-service-1.0.0.jar
   java -jar merchant-service/target/merchant-service-1.0.0.jar
   java -jar payment-service/target/payment-service-1.0.0.jar
   java -jar wallet-service/target/wallet-service-1.0.0.jar
   java -jar transaction-service/target/transaction-service-1.0.0.jar
   java -jar settlement-service/target/settlement-service-1.0.0.jar
   java -jar notification-service/target/notification-service-1.0.0.jar
   java -jar ai-assistant-service/target/ai-assistant-service-1.0.0.jar
   ```

5. **Start Frontend Dashboard**:
   ```powershell
   cd razorpay-frontend
   npm.cmd install    # (or npm install on Linux/macOS)
   npm.cmd run dev    # (or npm run dev on Linux/macOS)
   ```

---

### Step 4: Stop All Local Services
When you are done testing:
```powershell
# On Windows:
.\stop-local.bat

# On Linux/macOS:
./stop-local.sh

# To stop the infrastructure containers:
docker compose -f docker-compose.infra.yml down
```

---

## 4. Method 2: Full Docker Compose

To run the entire platform (all 16 services including frontend) packaged inside Docker:

### Step 1: Build Docker Images
```powershell
# On Windows:
.\docker-build.bat

# On Linux/macOS:
chmod +x docker-build.sh
./docker-build.sh
```

### Step 2: Launch Stack
```powershell
docker compose up -d
```

### Step 3: Monitor Logs
```powershell
# View all running containers:
docker compose ps

# Follow logs of API Gateway:
docker compose logs -f api-gateway

# Follow logs of Payment Service:
docker compose logs -f payment-service
```

### Step 4: Stop Stack
```powershell
docker compose down
```

---

## 5. Method 3: Kubernetes Deployment

For deploying to Kubernetes (Minikube, Kind, or production EKS/GKE):

### Step 1: Ensure Cluster is Running
For Minikube:
```bash
minikube start --memory=8192 --cpus=4
```

### Step 2: Deploy All Manifests
```powershell
# On Windows:
.\k8s-deploy.bat

# On Linux/macOS:
chmod +x k8s-deploy.sh
./k8s-deploy.sh
```

### Step 3: Verify Pods & Services
```bash
kubectl get pods,svc,hpa -n razorpay-system
```

### Step 4: Access Ingress / Services
If using Minikube tunnel:
```bash
minikube tunnel
```
Add hosts to your `/etc/hosts` or `C:\Windows\System32\drivers\etc\hosts`:
```text
127.0.0.1 api.razorpay.local dashboard.razorpay.local
```

---

## 6. Step-by-Step End-to-End API Walkthrough

Once the platform is running, test the complete payment processing flow using cURL or Postman.

### Step 1: Open the Frontend Dashboard
Navigate to [http://localhost:3000](http://localhost:3000) in your browser:
- Explore the **Overview Tab** for real-time revenue stats.
- Explore the **Hosted Checkout Simulator** to simulate UPI and Card payments interactively.
- Open the **AI Copilot** side-drawer to test real-time merchant querying.

---

### Step 2: Authentication (Login, Signin, Signup, Register)

#### 1. Sign Up / Register a Merchant Account:
You can use either `/api/v1/auth/signup` or `/api/v1/auth/register`:
```bash
curl -X POST http://localhost:8080/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Aarav Sharma",
    "businessName": "Aarav Tech Ventures",
    "email": "aarav.sharma@example.com",
    "password": "Password123!",
    "phone": "+919876543210"
  }'
```

#### 2. Sign In / Login to Receive JWT Token:
You can use either `/api/v1/auth/signin` or `/api/v1/auth/login`:
```bash
curl -X POST http://localhost:8080/api/v1/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "aarav.sharma@example.com",
    "password": "Password123!"
  }'
```
*Copy the `token` string from the JSON response to use as `Bearer <YOUR_JWT_TOKEN>`.*

#### 3. Fetch Current Authenticated Profile:
```bash
curl -X GET http://localhost:8080/api/v1/auth/me \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

---

### Step 3: Create an Order (Payment Service)
```bash
curl -X POST http://localhost:8080/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "X-Merchant-Id: 11111111-1111-1111-1111-111111111111" \
  -d '{
    "amount": 1499.00,
    "currency": "INR",
    "description": "Premium Annual Subscription"
  }'
```
*Note down the returned `orderId` (e.g., `order_...`).*

---

### Step 4: Process an Idempotent Payment
Process payment with an `Idempotency-Key` header:
```bash
curl -X POST http://localhost:8080/api/v1/payments/process \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "Idempotency-Key: idemp_order_1001_attempt_1" \
  -H "X-Merchant-Id: 11111111-1111-1111-1111-111111111111" \
  -d '{
    "orderId": "order_test_1001",
    "amount": 1499.00,
    "method": "UPI",
    "vpa": "aarav@okhdfcbank",
    "customerEmail": "aarav.sharma@example.com",
    "customerPhone": "+919876543210"
  }'
```

> **Idempotency Test**: Run the exact same `curl` command a second time. Notice that it immediately returns the cached transaction response without double-charging or re-publishing duplicate Kafka credit events!

---

### Step 5: Query Double-Entry Ledger (Transaction Service)
```bash
curl -X GET "http://localhost:8080/api/v1/transactions?merchantId=11111111-1111-1111-1111-111111111111" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

---

### Step 6: Query AI Assistant & Copilot
```bash
# 1. Get automated health insights and anomaly risk scores:
curl -X GET http://localhost:8080/api/v1/ai/insights \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "X-Merchant-Id: 11111111-1111-1111-1111-111111111111"

# 2. Chat with the AI Copilot:
curl -X POST http://localhost:8080/api/v1/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -H "X-Merchant-Id: 11111111-1111-1111-1111-111111111111" \
  -d '{"message": "What payment method has the highest success rate?"}'
```

---

## 7. Troubleshooting & FAQ

### Q1: `npm : File ... npm.ps1 cannot be loaded` on Windows PowerShell
**Solution**: Windows execution policy prevents running unsigned `.ps1` wrapper scripts. Run `npm.cmd` explicitly instead:
```powershell
npm.cmd install
npm.cmd run dev
```

### Q2: Port 5432 or 8080 is already in use
**Solution**: Check what process is using the port:
```powershell
netstat -ano | findstr :8080
netstat -ano | findstr :5432
```
Stop the existing service or kill the process using `taskkill /PID <PID> /F`.

### Q3: Microservices fail to register with Eureka
**Solution**: Ensure `service-registry` is fully up before starting downstream microservices. You can verify that Eureka is ready by navigating to [http://localhost:8761](http://localhost:8761) and confirming the dashboard loads.

### Q4: Database connection refused on startup
**Solution**: Ensure the Docker container for Postgres has completed database creation:
```powershell
docker compose -f docker-compose.infra.yml logs postgres
```
You should see: `database system is ready to accept connections`.

---

## 📚 Related Files
- Orchestration: [docker-compose.yml](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/razorpay-distributed-system/docker-compose.yml)
- Infrastructure: [docker-compose.infra.yml](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/razorpay-distributed-system/docker-compose.infra.yml)
- Local Launchers: [run-local.bat](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/razorpay-distributed-system/run-local.bat) | [run-local.sh](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/razorpay-distributed-system/run-local.sh)
- Kubernetes Manifests: [k8s/](file:///c:/Users/hp/.gemini/antigravity-ide/scratch/razorpay-distributed-system/k8s)
