package com.razorpay.common.dto;

import com.razorpay.common.enums.WalletTxnType;
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
public class WalletDTO {
    private UUID id;
    private UUID userId;
    private BigDecimal balance;
    private String currency;
    private Instant updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Transaction {
        private UUID id;
        private UUID walletId;
        private WalletTxnType type;
        private BigDecimal amount;
        private BigDecimal balanceAfter;
        private String referenceId;
        private String description;
        private Instant createdAt;
    }
}
