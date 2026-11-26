package com.razorpay.payment.web.controller;

import com.razorpay.common.dto.ApiResponse;
import com.razorpay.common.dto.PaymentDTO;
import com.razorpay.common.dto.ProcessPaymentRequest;
import com.razorpay.common.dto.RefundDTO;
import com.razorpay.common.idempotency.Idempotent;
import com.razorpay.common.security.SecurityConstants;
import com.razorpay.payment.application.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/process")
    @Idempotent(headerName = "Idempotency-Key", ttlSeconds = 120)
    public ResponseEntity<ApiResponse<PaymentDTO>> processPayment(
            @Valid @RequestBody ProcessPaymentRequest request,
            @RequestHeader(name = SecurityConstants.X_MERCHANT_ID, required = false) String merchantIdStr) {

        UUID merchantId = (merchantIdStr != null && !merchantIdStr.isBlank())
                ? UUID.fromString(merchantIdStr)
                : null;

        PaymentDTO payment = paymentService.processPayment(request, merchantId);
        return new ResponseEntity<>(ApiResponse.ok("Payment processed successfully", payment), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PaymentDTO>>> getMerchantPayments(
            @RequestHeader(name = SecurityConstants.X_MERCHANT_ID, defaultValue = "11111111-1111-1111-1111-111111111111") String merchantIdStr) {
        List<PaymentDTO> payments = paymentService.getPaymentsByMerchant(UUID.fromString(merchantIdStr));
        return ResponseEntity.ok(ApiResponse.ok(payments));
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<ApiResponse<PaymentDTO>> getPaymentById(@PathVariable String paymentId) {
        PaymentDTO payment = paymentService.getPaymentById(paymentId);
        return ResponseEntity.ok(ApiResponse.ok(payment));
    }

    @PostMapping("/{paymentId}/refund")
    public ResponseEntity<ApiResponse<RefundDTO>> refundPayment(
            @PathVariable String paymentId,
            @RequestBody(required = false) Map<String, Object> body,
            @RequestHeader(name = SecurityConstants.X_MERCHANT_ID, defaultValue = "11111111-1111-1111-1111-111111111111") String merchantIdStr) {

        BigDecimal amount = (body != null && body.containsKey("amount"))
                ? new BigDecimal(body.get("amount").toString())
                : null;
        String reason = (body != null && body.containsKey("reason"))
                ? (String) body.get("reason")
                : "Merchant initiated refund";

        RefundDTO refund = paymentService.createRefund(paymentId, amount, reason, UUID.fromString(merchantIdStr));
        return new ResponseEntity<>(ApiResponse.ok("Refund processed successfully", refund), HttpStatus.OK);
    }
}
