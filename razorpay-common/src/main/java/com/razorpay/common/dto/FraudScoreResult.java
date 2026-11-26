package com.razorpay.common.dto;

import com.razorpay.common.enums.RiskLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FraudScoreResult {
    private int score; // 0 (safest) to 100 (highest risk)
    private RiskLevel riskLevel;
    private boolean blocked;
    private List<String> flaggedSignals;
    private String rationale;
}
