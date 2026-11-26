package com.razorpay.merchant.web.controller;

import com.razorpay.common.dto.ApiResponse;
import com.razorpay.common.dto.MerchantDTO;
import com.razorpay.common.security.SecurityConstants;
import com.razorpay.merchant.application.service.MerchantService;
import com.razorpay.merchant.domain.model.WebhookEndpoint;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/merchants")
@RequiredArgsConstructor
public class MerchantController {

    private final MerchantService merchantService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<MerchantDTO>> getCurrentMerchant(
            @RequestHeader(name = SecurityConstants.X_MERCHANT_ID, required = false) String merchantIdStr,
            @RequestHeader(name = SecurityConstants.X_USER_ID, required = false) String userIdStr) {
        
        if (merchantIdStr != null && !merchantIdStr.isBlank()) {
            MerchantDTO merchant = merchantService.getMerchantById(UUID.fromString(merchantIdStr));
            return ResponseEntity.ok(ApiResponse.ok(merchant));
        } else if (userIdStr != null && !userIdStr.isBlank()) {
            MerchantDTO merchant = merchantService.getMerchantByUserId(UUID.fromString(userIdStr));
            return ResponseEntity.ok(ApiResponse.ok(merchant));
        }
        
        // Fallback default demo merchant
        MerchantDTO merchant = merchantService.getMerchantById(UUID.fromString("11111111-1111-1111-1111-111111111111"));
        return ResponseEntity.ok(ApiResponse.ok(merchant));
    }

    @GetMapping("/keys")
    public ResponseEntity<ApiResponse<List<MerchantDTO.ApiKeyResponse>>> getApiKeys(
            @RequestHeader(name = SecurityConstants.X_MERCHANT_ID, defaultValue = "11111111-1111-1111-1111-111111111111") String merchantIdStr) {
        List<MerchantDTO.ApiKeyResponse> keys = merchantService.getActiveKeys(UUID.fromString(merchantIdStr));
        return ResponseEntity.ok(ApiResponse.ok(keys));
    }

    @PostMapping("/keys/generate")
    public ResponseEntity<ApiResponse<MerchantDTO.ApiKeyResponse>> generateApiKey(
            @RequestHeader(name = SecurityConstants.X_MERCHANT_ID, defaultValue = "11111111-1111-1111-1111-111111111111") String merchantIdStr,
            @RequestBody(required = false) Map<String, String> body) {
        String env = (body != null && body.containsKey("environment")) ? body.get("environment") : "TEST";
        MerchantDTO.ApiKeyResponse key = merchantService.generateApiKey(UUID.fromString(merchantIdStr), env);
        return new ResponseEntity<>(ApiResponse.ok("API Key generated successfully", key), HttpStatus.CREATED);
    }

    @GetMapping("/webhooks")
    public ResponseEntity<ApiResponse<List<WebhookEndpoint>>> getWebhooks(
            @RequestHeader(name = SecurityConstants.X_MERCHANT_ID, defaultValue = "11111111-1111-1111-1111-111111111111") String merchantIdStr) {
        List<WebhookEndpoint> endpoints = merchantService.getWebhooks(UUID.fromString(merchantIdStr));
        return ResponseEntity.ok(ApiResponse.ok(endpoints));
    }

    @PostMapping("/webhooks")
    public ResponseEntity<ApiResponse<WebhookEndpoint>> createWebhook(
            @RequestHeader(name = SecurityConstants.X_MERCHANT_ID, defaultValue = "11111111-1111-1111-1111-111111111111") String merchantIdStr,
            @RequestBody Map<String, String> request) {
        String url = request.get("url");
        String events = request.get("events");
        WebhookEndpoint endpoint = merchantService.createWebhook(UUID.fromString(merchantIdStr), url, events);
        return new ResponseEntity<>(ApiResponse.ok("Webhook configured", endpoint), HttpStatus.CREATED);
    }
}
