package com.razorpay.common.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEvent implements Serializable {
    private String eventId;
    private String recipient; // Email, phone, or merchant/order ID for websocket
    private String type; // EMAIL, SMS, WEBSOCKET
    private String channel; // "checkout.order_123", "merchant.m_456"
    private String subject;
    private String message;
    private Map<String, Object> payload;
    @Builder.Default
    private Instant timestamp = Instant.now();
}
