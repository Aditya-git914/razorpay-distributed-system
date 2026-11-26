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
public class RefundProcessedEvent implements Serializable {
    private String refundId;
    private String paymentId;
    private UUID merchantId;
    private BigDecimal amount;
    private String reason;
    private String status;
    @Builder.Default
    private Instant timestamp = Instant.now();
}
