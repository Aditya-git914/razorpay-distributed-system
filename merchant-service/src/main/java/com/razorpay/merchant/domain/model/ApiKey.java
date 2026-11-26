package com.razorpay.merchant.domain.model;

import com.razorpay.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "api_keys")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiKey extends BaseEntity {

    @Column(name = "merchant_id", nullable = false)
    private UUID merchantId;

    @Column(name = "key_id", nullable = false, unique = true)
    private String keyId;

    @Column(name = "key_secret", nullable = false)
    private String keySecret;

    @Column(nullable = false)
    @Builder.Default
    private String environment = "TEST"; // TEST or LIVE

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;
}
