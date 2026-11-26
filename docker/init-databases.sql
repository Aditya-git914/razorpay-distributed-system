-- PostgreSQL Initialization Script for Razorpay Microservices
CREATE DATABASE razorpay_user_db;
CREATE DATABASE razorpay_merchant_db;
CREATE DATABASE razorpay_payment_db;
CREATE DATABASE razorpay_wallet_db;
CREATE DATABASE razorpay_transaction_db;
CREATE DATABASE razorpay_settlement_db;

GRANT ALL PRIVILEGES ON DATABASE razorpay_user_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE razorpay_merchant_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE razorpay_payment_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE razorpay_wallet_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE razorpay_transaction_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE razorpay_settlement_db TO postgres;
