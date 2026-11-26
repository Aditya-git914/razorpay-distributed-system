package com.razorpay.settlement.web.controller;

import com.razorpay.common.dto.ApiResponse;
import com.razorpay.common.dto.SettlementDTO;
import com.razorpay.common.security.SecurityConstants;
import com.razorpay.settlement.application.service.SettlementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/settlements")
@RequiredArgsConstructor
public class SettlementController {

    private final SettlementService settlementService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<SettlementDTO>>> getSettlements(
            @RequestHeader(name = SecurityConstants.X_MERCHANT_ID, defaultValue = "11111111-1111-1111-1111-111111111111") String merchantIdStr) {
        List<SettlementDTO> settlements = settlementService.getMerchantSettlements(UUID.fromString(merchantIdStr));
        return ResponseEntity.ok(ApiResponse.ok(settlements));
    }

    @PostMapping("/trigger")
    public ResponseEntity<ApiResponse<SettlementDTO>> triggerInstantSettlement(
            @RequestHeader(name = SecurityConstants.X_MERCHANT_ID, defaultValue = "11111111-1111-1111-1111-111111111111") String merchantIdStr,
            @RequestBody(required = false) Map<String, Object> body) {

        BigDecimal amount = (body != null && body.containsKey("amount"))
                ? new BigDecimal(body.get("amount").toString())
                : null;

        SettlementDTO settlement = settlementService.triggerInstantSettlement(UUID.fromString(merchantIdStr), amount);
        return new ResponseEntity<>(ApiResponse.ok("Instant settlement triggered successfully", settlement), HttpStatus.CREATED);
    }
}
