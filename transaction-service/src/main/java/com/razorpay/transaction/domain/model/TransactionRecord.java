package com.razorpay.transaction.domain.model;

import com.razorpay.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionRecord extends BaseEntity {

    @Column(name = "txn_reference", nullable = false, unique = true)
    private String txnReference;

    @Column(name = "payment_id")
    private String paymentId;

    @Column(name = "order_id")
    private String orderId;

    @Column(name = "merchant_id", nullable = false)
    private UUID merchantId;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal amount;

    @Column(precision = 19, scale = 4)
    private BigDecimal fee;

    @Column(precision = 19, scale = 4)
    private BigDecimal tax;

    @Column(name = "net_amount", precision = 19, scale = 4)
    private BigDecimal netAmount;

    @Column(nullable = false)
    private String type; // PAYMENT, REFUND, SETTLEMENT, WALLET_TOPUP

    @Column(nullable = false)
    private String status; // SUCCESS, FAILED, PENDING

    @Column
    private String method; // UPI, CARD, NETBANKING, WALLET, QR

    @Column(name = "customer_email")
    private String customerEmail;

    @Column(name = "timestamp", nullable = false)
    private Instant timestamp;
}
