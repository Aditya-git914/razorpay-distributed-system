package com.razorpay.ai.web.controller;

import com.razorpay.ai.application.service.AiAssistantService;
import com.razorpay.common.dto.AIInsightDTO;
import com.razorpay.common.dto.ApiResponse;
import com.razorpay.common.dto.FraudScoreResult;
import com.razorpay.common.dto.ProcessPaymentRequest;
import com.razorpay.common.security.SecurityConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiAssistantService aiService;

    @PostMapping("/fraud/score")
    public ResponseEntity<ApiResponse<FraudScoreResult>> scoreFraud(@RequestBody ProcessPaymentRequest request) {
        FraudScoreResult scoreResult = aiService.scoreTransaction(request);
        return ResponseEntity.ok(ApiResponse.ok(scoreResult));
    }

    @GetMapping("/insights")
    public ResponseEntity<ApiResponse<AIInsightDTO>> getInsights(
            @RequestHeader(name = SecurityConstants.X_MERCHANT_ID, defaultValue = "11111111-1111-1111-1111-111111111111") String merchantIdStr) {
        AIInsightDTO insights = aiService.generateMerchantInsights(UUID.fromString(merchantIdStr));
        return ResponseEntity.ok(ApiResponse.ok(insights));
    }

    @PostMapping("/query")
    public ResponseEntity<ApiResponse<Map<String, Object>>> executeNaturalLanguageQuery(
            @RequestHeader(name = SecurityConstants.X_MERCHANT_ID, defaultValue = "11111111-1111-1111-1111-111111111111") String merchantIdStr,
            @RequestBody Map<String, String> body) {
        String query = body.get("query");
        Map<String, Object> result = aiService.executeNaturalLanguageQuery(query, UUID.fromString(merchantIdStr));
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<Map<String, Object>>> chatWithCopilot(
            @RequestHeader(name = SecurityConstants.X_MERCHANT_ID, defaultValue = "11111111-1111-1111-1111-111111111111") String merchantIdStr,
            @RequestBody Map<String, String> body) {
        String message = body.get("message");
        Map<String, Object> result = aiService.chatWithCopilot(message, UUID.fromString(merchantIdStr));
        return ResponseEntity.ok(ApiResponse.ok(result));
    }
}
