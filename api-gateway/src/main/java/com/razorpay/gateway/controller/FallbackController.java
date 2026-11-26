package com.razorpay.gateway.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/fallback")
public class FallbackController {

    @RequestMapping("/user")
    public ResponseEntity<Map<String, Object>> userServiceFallback() {
        return buildFallback("User Service is temporarily unavailable. Please try again shortly.");
    }

    @RequestMapping("/merchant")
    public ResponseEntity<Map<String, Object>> merchantServiceFallback() {
        return buildFallback("Merchant Service is experiencing delays. Circuit breaker triggered.");
    }

    @RequestMapping("/payment")
    public ResponseEntity<Map<String, Object>> paymentServiceFallback() {
        return buildFallback("Payment gateway is temporarily throttling requests. Please retry in a moment.");
    }

    @RequestMapping("/wallet")
    public ResponseEntity<Map<String, Object>> walletServiceFallback() {
        return buildFallback("Wallet service is currently undergoing maintenance.");
    }

    @RequestMapping("/transaction")
    public ResponseEntity<Map<String, Object>> transactionServiceFallback() {
        return buildFallback("Transaction search and ledger is currently unavailable.");
    }

    @RequestMapping("/settlement")
    public ResponseEntity<Map<String, Object>> settlementServiceFallback() {
        return buildFallback("Settlement service is temporarily unavailable.");
    }

    @RequestMapping("/notification")
    public ResponseEntity<Map<String, Object>> notificationServiceFallback() {
        return buildFallback("Notification service is degraded. Delivery will be delayed.");
    }

    @RequestMapping("/ai")
    public ResponseEntity<Map<String, Object>> aiServiceFallback() {
        return buildFallback("AI Analytics & Copilot engine is temporarily offline.");
    }

    private ResponseEntity<Map<String, Object>> buildFallback(String message) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of(
                "success", false,
                "message", message,
                "status", HttpStatus.SERVICE_UNAVAILABLE.value(),
                "timestamp", Instant.now().toString()
        ));
    }
}
