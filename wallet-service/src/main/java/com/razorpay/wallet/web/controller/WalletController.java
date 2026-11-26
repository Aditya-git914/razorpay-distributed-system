package com.razorpay.wallet.web.controller;

import com.razorpay.common.dto.ApiResponse;
import com.razorpay.common.dto.WalletDTO;
import com.razorpay.common.security.SecurityConstants;
import com.razorpay.wallet.application.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/wallets")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<WalletDTO>> getMyWallet(
            @RequestHeader(name = SecurityConstants.X_USER_ID, defaultValue = "22222222-2222-2222-2222-222222222222") String userIdStr) {
        WalletDTO wallet = walletService.getWalletByUserId(UUID.fromString(userIdStr));
        return ResponseEntity.ok(ApiResponse.ok(wallet));
    }

    @PostMapping("/recharge")
    public ResponseEntity<ApiResponse<WalletDTO>> rechargeWallet(
            @RequestHeader(name = SecurityConstants.X_USER_ID, defaultValue = "22222222-2222-2222-2222-222222222222") String userIdStr,
            @RequestBody Map<String, Object> body) {
        BigDecimal amount = new BigDecimal(body.get("amount").toString());
        String refId = (String) body.getOrDefault("referenceId", "recharge_" + System.currentTimeMillis());
        WalletDTO wallet = walletService.credit(UUID.fromString(userIdStr), amount, refId, "Wallet Top-up");
        return ResponseEntity.ok(ApiResponse.ok("Wallet recharged successfully", wallet));
    }

    @PostMapping("/debit")
    public ResponseEntity<ApiResponse<WalletDTO>> debitWallet(
            @RequestHeader(name = SecurityConstants.X_USER_ID, defaultValue = "22222222-2222-2222-2222-222222222222") String userIdStr,
            @RequestBody Map<String, Object> body) {
        BigDecimal amount = new BigDecimal(body.get("amount").toString());
        String refId = (String) body.get("referenceId");
        String desc = (String) body.get("description");
        WalletDTO wallet = walletService.debit(UUID.fromString(userIdStr), amount, refId, desc);
        return ResponseEntity.ok(ApiResponse.ok("Wallet debited", wallet));
    }

    @GetMapping("/{walletId}/transactions")
    public ResponseEntity<ApiResponse<List<WalletDTO.Transaction>>> getTransactions(@PathVariable UUID walletId) {
        List<WalletDTO.Transaction> txns = walletService.getTransactions(walletId);
        return ResponseEntity.ok(ApiResponse.ok(txns));
    }
}
