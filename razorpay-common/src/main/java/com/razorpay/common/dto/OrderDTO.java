package com.razorpay.common.dto;

import com.razorpay.common.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private UUID id;
    private String orderId;
    private UUID merchantId;
    private BigDecimal amount;
    private String currency;
    private String receipt;
    private OrderStatus status;
    private Map<String, Object> notes;
    private Instant createdAt;
}
