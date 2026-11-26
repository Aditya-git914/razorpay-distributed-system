package com.razorpay.transaction.web.controller;

import com.razorpay.common.dto.ApiResponse;
import com.razorpay.common.security.SecurityConstants;
import com.razorpay.transaction.application.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final TransactionService transactionService;

    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOverview(
            @RequestHeader(name = SecurityConstants.X_MERCHANT_ID, defaultValue = "11111111-1111-1111-1111-111111111111") String merchantIdStr) {
        Map<String, Object> analytics = transactionService.getAnalyticsOverview(UUID.fromString(merchantIdStr));
        return ResponseEntity.ok(ApiResponse.ok(analytics));
    }
}
