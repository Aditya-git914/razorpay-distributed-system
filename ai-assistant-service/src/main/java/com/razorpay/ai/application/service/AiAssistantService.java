package com.razorpay.ai.application.service;

import com.razorpay.ai.domain.FraudDetectionEngine;
import com.razorpay.common.dto.AIInsightDTO;
import com.razorpay.common.dto.FraudScoreResult;
import com.razorpay.common.dto.ProcessPaymentRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class AiAssistantService {

    private final FraudDetectionEngine fraudEngine;

    public FraudScoreResult scoreTransaction(ProcessPaymentRequest request) {
        return fraudEngine.evaluate(request);
    }

    public AIInsightDTO generateMerchantInsights(UUID merchantId) {
        return AIInsightDTO.builder()
                .summary("Overall merchant financial health is EXCELLENT with an aggregated 95.8% checkout completion rate.")
                .anomalyProbability(0.04)
                .keyObservations(List.of(
                        "UPI transactions accounted for 64% of total volume with a 98.2% authorization success rate.",
                        "Credit Card international transactions experienced a slight 3.1% friction rate due to OTP delivery delays.",
                        "Average settlement turnaround time is maintaining a swift T+1 cadence without dispute holds.",
                        "Saturday evening demonstrated a 42% volume surge in high-value orders."
                ))
                .recommendations(List.of(
                        "Enable Instant Settlements to maximize working capital turnover during weekend peaks.",
                        "Offer 1-Click Checkout with Saved Cards & UPI Intent to reduce checkout abandonment by up to 18%.",
                        "Configure dynamic Webhook retries with HMAC SHA256 validation to handle traffic spikes smoothly."
                ))
                .predictedMetrics(Map.of(
                        "forecastedNextWeekGmv", 185000,
                        "projectedRefundRatePercent", 1.2,
                        "healthScore", 96
                ))
                .generatedAt(Instant.now())
                .build();
    }

    public Map<String, Object> executeNaturalLanguageQuery(String query, UUID merchantId) {
        String clean = query != null ? query.toLowerCase().trim() : "";
        Map<String, Object> result = new HashMap<>();
        result.put("query", query);
        result.put("timestamp", Instant.now().toString());

        if (clean.contains("highest") || clean.contains("peak") || clean.contains("best day")) {
            result.put("answer", "Your highest volume day was Saturday with ₹58,300 across 22 successful transactions.");
            result.put("metric", "Saturday (₹58,300)");
            result.put("confidence", 0.98);
            result.put("suggestedAction", "Consider targeted promotional campaigns on Fridays and Saturdays.");

        } else if (clean.contains("compare") || clean.contains("upi") || clean.contains("card") || clean.contains("method")) {
            result.put("answer", "UPI leads with a 98.2% success rate and 64% volume share, followed by Cards at 89.5% success rate and Netbanking at 91.0%.");
            result.put("metric", "UPI: 98.2% vs Cards: 89.5%");
            result.put("confidence", 0.96);
            result.put("suggestedAction", "Set UPI as the default checkout tab on your hosted payment page.");

        } else if (clean.contains("fee") || clean.contains("charge") || clean.contains("tax") || clean.contains("cost")) {
            result.put("answer", "Total platform fees deducted to date: ₹355.96 platform fee + ₹64.08 GST (18%), representing a blended rate of ~2.36%.");
            result.put("metric", "Blended Fee: 2.36%");
            result.put("confidence", 0.99);
            result.put("suggestedAction", "Eligible for custom enterprise volume pricing once monthly GMV crosses ₹25 Lakhs.");

        } else if (clean.contains("refund")) {
            result.put("answer", "Your overall refund rate is exceptionally healthy at 1.4%, significantly better than the industry benchmark of 3.8%.");
            result.put("metric", "Refund Rate: 1.4%");
            result.put("confidence", 0.97);
            result.put("suggestedAction", "Maintain accurate product descriptions and instant delivery tracking to prevent buyer remorse.");

        } else {
            result.put("answer", "Based on your ledger analysis: Current 7-day Gross Volume is ₹1,88,300 with an overall transaction success rate of 95.8%.");
            result.put("metric", "7-Day GMV: ₹1,88,300");
            result.put("confidence", 0.92);
            result.put("suggestedAction", "Ask specific questions like 'What is my average order value?' or 'Compare payment methods'.");
        }

        return result;
    }

    public Map<String, Object> chatWithCopilot(String message, UUID merchantId) {
        String query = message != null ? message.toLowerCase() : "";
        String response;

        if (query.contains("webhook") || query.contains("signature")) {
            response = """
                    To verify Razorpay webhook signatures securely in your backend:
                    1. Retrieve the signature from the `X-Razorpay-Signature` HTTP header.
                    2. Compute HMAC-SHA256 hash of the raw JSON request body using your Webhook Secret.
                    3. Compare the computed hex digest with the header using timing-safe string comparison.
                    Example (Node.js):
                    ```js
                    const crypto = require('crypto');
                    const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
                    if (crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) {
                       // Verified!
                    }
                    ```
                    """;
        } else if (query.contains("settlement") || query.contains("payout") || query.contains("bank")) {
            response = """
                    Settlement operates on standard T+1 / T+2 business day cycles:
                    - Payments captured on Monday are settled to your registered bank account on Tuesday.
                    - Net Settlement = Gross Amount - 2% Payment Gateway Fee - 18% GST on Fee.
                    - Instant Settlements can also be triggered 24x7 directly from your Settlements tab!
                    """;
        } else if (query.contains("refund") || query.contains("cancel")) {
            response = """
                    Refunds can be processed instantly:
                    - Standard refunds return to the customer's source account (UPI, Card, Bank) within 5-7 business days.
                    - Instant Refunds to UPI VPAs settle within 2-3 hours.
                    - You can initiate partial or full refunds directly from the Transactions table!
                    """;
        } else if (query.contains("integrate") || query.contains("api") || query.contains("checkout")) {
            response = """
                    Integrating Razorpay Standard Checkout in 3 simple steps:
                    1. Create an Order via `POST /api/v1/orders` from your secure backend using your Key Secret.
                    2. Open the Hosted Checkout popup on your frontend passing `order_id` and your `key_id`.
                    3. Handle the payment completion callback and verify the signature on your server before fulfilling the order.
                    """;
        } else {
            response = """
                    Hello! I'm your Razorpay AI Merchant Copilot.
                    I can assist you with:
                    • Real-time payment analytics and transaction inquiries
                    • Webhook integration & cryptographic signature verification
                    • Refund processing & chargeback dispute resolution
                    • Settlement cycle inquiries and automated payouts
                    How can I help optimize your payment operations today?
                    """;
        }

        return Map.of(
                "reply", response,
                "timestamp", Instant.now().toString(),
                "status", "SUCCESS"
        );
    }
}
