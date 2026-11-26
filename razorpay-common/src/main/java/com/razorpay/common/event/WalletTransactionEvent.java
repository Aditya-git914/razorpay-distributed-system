package com.razorpay.common.event;

import com.razorpay.common.enums.WalletTxnType;
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
public class WalletTransactionEvent implements Serializable {
    private UUID walletId;
    private UUID userId;
    private WalletTxnType type;
    private BigDecimal amount;
    private BigDecimal newBalance;
    private String referenceId;
    private String description;
    @Builder.Default
    private Instant timestamp = Instant.now();
}
