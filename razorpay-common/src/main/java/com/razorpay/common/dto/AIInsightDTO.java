package com.razorpay.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIInsightDTO {
    private String summary;
    private double anomalyProbability;
    private List<String> keyObservations;
    private List<String> recommendations;
    private Map<String, Object> predictedMetrics;
    @Builder.Default
    private Instant generatedAt = Instant.now();
}
