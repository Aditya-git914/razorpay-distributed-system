package com.razorpay.settlement.domain.model;

import com.razorpay.common.entity.BaseEntity;
import com.razorpay.common.enums.SettlementStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "settlements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Settlement extends BaseEntity {

    @Column(name = "settlement_id", nullable = false, unique = true)
    private String settlementId;

    @Column(name = "merchant_id", nullable = false)
    private UUID merchantId;

    @Column(name = "gross_amount", nullable = false, precision = 19, scale = 4)
    private BigDecimal grossAmount;

    @Column(name = "fees_deducted", nullable = false, precision = 19, scale = 4)
    private BigDecimal feesDeducted;

    @Column(name = "tax_deducted", nullable = false, precision = 19, scale = 4)
    private BigDecimal taxDeducted;

    @Column(name = "net_amount", nullable = false, precision = 19, scale = 4)
    private BigDecimal netAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private SettlementStatus status = SettlementStatus.SETTLED;

    @Column(name = "utr_number")
    private String utrNumber;

    @Column(name = "settled_at")
    private Instant settledAt;
}
