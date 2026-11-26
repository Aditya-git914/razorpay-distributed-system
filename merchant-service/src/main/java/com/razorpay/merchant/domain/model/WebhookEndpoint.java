package com.razorpay.merchant.domain.model;

import com.razorpay.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "webhook_endpoints")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WebhookEndpoint extends BaseEntity {

    @Column(name = "merchant_id", nullable = false)
    private UUID merchantId;

    @Column(nullable = false)
    private String url;

    @Column(nullable = false)
    private String secret;

    @Column(nullable = false)
    @Builder.Default
    private String events = "payment.authorized,payment.failed,payment.captured,refund.processed";

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;
}
