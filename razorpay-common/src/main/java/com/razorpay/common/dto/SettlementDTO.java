package com.razorpay.common.dto;

import com.razorpay.common.enums.SettlementStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SettlementDTO {
    private UUID id;
    private String settlementId;
    private UUID merchantId;
    private BigDecimal grossAmount;
    private BigDecimal feesDeducted;
    private BigDecimal taxDeducted;
    private BigDecimal netAmount;
    private SettlementStatus status;
    private String utrNumber;
    private Instant settledAt;
    private Instant createdAt;
}
