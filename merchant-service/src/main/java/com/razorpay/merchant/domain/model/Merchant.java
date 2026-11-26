package com.razorpay.merchant.domain.model;

import com.razorpay.common.entity.BaseEntity;
import com.razorpay.common.enums.KycStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "merchants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Merchant extends BaseEntity {

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "business_name", nullable = false)
    private String businessName;

    @Column(name = "business_type")
    private String businessType;

    @Column(name = "pan_number")
    private String panNumber;

    @Column(name = "gstin")
    private String gstin;

    @Enumerated(EnumType.STRING)
    @Column(name = "kyc_status", nullable = false)
    @Builder.Default
    private KycStatus kycStatus = KycStatus.VERIFIED;

    @Column(name = "bank_account_number")
    private String bankAccountNumber;

    @Column(name = "ifsc_code")
    private String ifscCode;

    @Column(name = "bank_name")
    private String bankName;

    @Column(name = "account_balance", precision = 19, scale = 4, nullable = false)
    @Builder.Default
    private BigDecimal accountBalance = BigDecimal.ZERO;
}
