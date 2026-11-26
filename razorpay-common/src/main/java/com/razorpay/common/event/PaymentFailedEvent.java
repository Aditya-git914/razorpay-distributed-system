package com.razorpay.common.event;

import com.razorpay.common.enums.PaymentMethod;
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
public class PaymentFailedEvent implements Serializable {
    private String paymentId;
    private String orderId;
    private UUID merchantId;
    private BigDecimal amount;
    private PaymentMethod method;
    private String errorCode;
    private String errorDescription;
    private String customerEmail;
    @Builder.Default
    private Instant timestamp = Instant.now();
}
