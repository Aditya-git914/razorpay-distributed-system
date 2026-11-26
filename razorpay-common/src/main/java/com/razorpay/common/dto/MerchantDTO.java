package com.razorpay.common.dto;

import com.razorpay.common.enums.KycStatus;
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
public class MerchantDTO {
    private UUID id;
    private UUID userId;
    private String businessName;
    private String businessType;
    private String panNumber;
    private String gstin;
    private KycStatus kycStatus;
    private String bankAccountNumber;
    private String ifscCode;
    private String bankName;
    private BigDecimal accountBalance;
    private Instant createdAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ApiKeyResponse {
        private String keyId;
        private String keySecret;
        private String environment;
        private boolean active;
        private Instant createdAt;
    }
}
