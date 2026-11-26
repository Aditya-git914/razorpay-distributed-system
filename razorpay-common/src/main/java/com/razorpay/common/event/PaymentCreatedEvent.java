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
public class PaymentCreatedEvent implements Serializable {
    private String paymentId;
    private String orderId;
    private UUID merchantId;
    private BigDecimal amount;
    private String currency;
    private PaymentMethod method;
    private String customerEmail;
    private String customerPhone;
    @Builder.Default
    private Instant timestamp = Instant.now();
}
