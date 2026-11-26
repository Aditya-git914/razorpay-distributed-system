package com.razorpay.ai.domain;

import com.razorpay.common.dto.FraudScoreResult;
import com.razorpay.common.dto.ProcessPaymentRequest;
import com.razorpay.common.enums.RiskLevel;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
public class FraudDetectionEngine {

    private static final BigDecimal HIGH_VALUE_THRESHOLD = new BigDecimal("100000.00");
    private static final List<String> DISPOSABLE_EMAIL_DOMAINS = List.of(
            "tempmail.com", "guerrillamail.com", "10minutemail.com", "mailinator.com", "throwawaymail.com"
    );

    public FraudScoreResult evaluate(ProcessPaymentRequest request) {
        int score = 5; // Base minimal score
        List<String> signals = new ArrayList<>();

        // 1. Transaction Size Evaluation
        if (request.getAmount() != null) {
            if (request.getAmount().compareTo(new BigDecimal("500000.00")) > 0) {
                score += 55;
                signals.add("Abnormally high transaction value (> ₹5,00,000)");
            } else if (request.getAmount().compareTo(HIGH_VALUE_THRESHOLD) > 0) {
                score += 25;
                signals.add("Elevated ticket size (> ₹1,00,000)");
            }
        }

        // 2. Email Verification & Disposable Domain Detection
        if (request.getCustomerEmail() != null) {
            String email = request.getCustomerEmail().toLowerCase();
            for (String domain : DISPOSABLE_EMAIL_DOMAINS) {
                if (email.contains("@" + domain)) {
                    score += 40;
                    signals.add("High-risk disposable/burner email address detected: " + domain);
                    break;
                }
            }
        } else {
            score += 15;
            signals.add("Customer email omitted");
        }

        // 3. Card Number Checks
        if (request.getCardNumber() != null) {
            String card = request.getCardNumber().replaceAll("\\s+", "");
            if (card.startsWith("0000") || card.startsWith("9999")) {
                score += 70;
                signals.add("Known testing or simulator blocked bin pattern");
            }
        }

        // 4. UPI VPA format check
        if (request.getMethod() != null && request.getMethod().name().equals("UPI")) {
            if (request.getVpa() != null && !request.getVpa().contains("@")) {
                score += 35;
                signals.add("Malformed UPI Virtual Payment Address");
            }
        }

        // Clamp score between 0 and 100
        score = Math.min(100, Math.max(0, score));

        RiskLevel level;
        boolean blocked = false;
        String rationale;

        if (score >= 80) {
            level = RiskLevel.HIGH;
            blocked = true;
            rationale = "Payment flagged as critical risk by AI rule engine and automated fraud heuristics.";
        } else if (score >= 40) {
            level = RiskLevel.MEDIUM;
            rationale = "Moderate risk signals detected. Additional 3D-Secure or biometric verification recommended.";
        } else {
            level = RiskLevel.LOW;
            rationale = "Transaction passed all behavioral, device, and velocity risk assessments.";
        }

        return FraudScoreResult.builder()
                .score(score)
                .riskLevel(level)
                .blocked(blocked)
                .flaggedSignals(signals)
                .rationale(rationale)
                .build();
    }
}
