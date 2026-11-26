package com.razorpay.payment.web.controller;

import com.razorpay.common.dto.ApiResponse;
import com.razorpay.common.dto.OrderDTO;
import com.razorpay.common.security.SecurityConstants;
import com.razorpay.payment.application.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderDTO>> createOrder(
            @RequestHeader(name = SecurityConstants.X_MERCHANT_ID, defaultValue = "11111111-1111-1111-1111-111111111111") String merchantIdStr,
            @RequestBody Map<String, Object> request) {

        BigDecimal amount = new BigDecimal(request.get("amount").toString());
        String currency = (String) request.getOrDefault("currency", "INR");
        String receipt = (String) request.get("receipt");
        String description = (String) request.get("description");

        OrderDTO order = paymentService.createOrder(amount, currency, receipt, description, UUID.fromString(merchantIdStr));
        return new ResponseEntity<>(ApiResponse.ok("Order created", order), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getMerchantOrders(
            @RequestHeader(name = SecurityConstants.X_MERCHANT_ID, defaultValue = "11111111-1111-1111-1111-111111111111") String merchantIdStr) {
        List<OrderDTO> orders = paymentService.getOrdersByMerchant(UUID.fromString(merchantIdStr));
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<OrderDTO>> getOrderById(@PathVariable String orderId) {
        OrderDTO order = paymentService.getOrderByOrderId(orderId);
        return ResponseEntity.ok(ApiResponse.ok(order));
    }

    // Public endpoint for Hosted Checkout without merchant auth header
    @GetMapping("/public/{orderId}")
    public ResponseEntity<ApiResponse<OrderDTO>> getPublicOrderById(@PathVariable String orderId) {
        OrderDTO order = paymentService.getOrderByOrderId(orderId);
        return ResponseEntity.ok(ApiResponse.ok(order));
    }
}
