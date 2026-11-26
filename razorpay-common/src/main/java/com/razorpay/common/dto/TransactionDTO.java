package com.razorpay.common.dto;

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
public class TransactionDTO {
    private UUID id;
    private String txnReference;
    private String paymentId;
    private String orderId;
    private UUID merchantId;
    private BigDecimal amount;
    private BigDecimal fee;
    private BigDecimal tax;
    private BigDecimal net;
    private String type; // PAYMENT, REFUND, SETTLEMENT, WALLET_TOPUP
    private String status; // SUCCESS, FAILED, PENDING
    private String method; // UPI, CARD, NETBANKING, WALLET
    private String customerEmail;
    private Instant timestamp;
}
