package com.razorpay.transaction.web.controller;

import com.razorpay.common.dto.ApiResponse;
import com.razorpay.common.dto.TransactionDTO;
import com.razorpay.common.security.SecurityConstants;
import com.razorpay.transaction.application.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TransactionDTO>>> getTransactions(
            @RequestHeader(name = SecurityConstants.X_MERCHANT_ID, defaultValue = "11111111-1111-1111-1111-111111111111") String merchantIdStr) {
        List<TransactionDTO> txns = transactionService.getMerchantTransactions(UUID.fromString(merchantIdStr));
        return ResponseEntity.ok(ApiResponse.ok(txns));
    }
}
