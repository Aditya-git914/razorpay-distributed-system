package com.razorpay.common.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SettlementCompletedEvent implements Serializable {
    private String settlementId;
    private UUID merchantId;
    private BigDecimal grossAmount;
    private BigDecimal netAmount;
    private String utrNumber;
    private String status;
    @Builder.Default
    private Instant timestamp = Instant.now();
}
