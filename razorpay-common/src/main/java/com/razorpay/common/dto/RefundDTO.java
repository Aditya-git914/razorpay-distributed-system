package com.razorpay.common.dto;

import com.razorpay.common.enums.RefundStatus;
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
public class RefundDTO {
    private UUID id;
    private String refundId;
    private String paymentId;
    private BigDecimal amount;
    private RefundStatus status;
    private String reason;
    private Instant createdAt;
}
