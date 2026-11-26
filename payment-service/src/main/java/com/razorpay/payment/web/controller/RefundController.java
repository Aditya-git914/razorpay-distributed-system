package com.razorpay.payment.web.controller;

import com.razorpay.common.dto.ApiResponse;
import com.razorpay.common.dto.RefundDTO;
import com.razorpay.common.security.SecurityConstants;
import com.razorpay.payment.application.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/refunds")
@RequiredArgsConstructor
public class RefundController {

    private final PaymentService paymentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RefundDTO>>> getMerchantRefunds(
            @RequestHeader(name = SecurityConstants.X_MERCHANT_ID, defaultValue = "11111111-1111-1111-1111-111111111111") String merchantIdStr) {
        List<RefundDTO> refunds = paymentService.getRefundsByMerchant(UUID.fromString(merchantIdStr));
        return ResponseEntity.ok(ApiResponse.ok(refunds));
    }
}
