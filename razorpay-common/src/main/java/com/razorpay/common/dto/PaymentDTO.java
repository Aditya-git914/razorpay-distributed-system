package com.razorpay.common.dto;

import com.razorpay.common.enums.PaymentMethod;
import com.razorpay.common.enums.PaymentStatus;
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
public class PaymentDTO {
    private UUID id;
    private String paymentId;
    private String orderId;
    private UUID merchantId;
    private BigDecimal amount;
    private BigDecimal fee;
    private BigDecimal tax;
    private String currency;
    private PaymentStatus status;
    private PaymentMethod method;
    private String bankReference;
    private String vpa;
    private String cardLast4;
    private String cardNetwork;
    private String customerEmail;
    private String customerPhone;
    private String errorCode;
    private String errorDescription;
    private Instant createdAt;
}
