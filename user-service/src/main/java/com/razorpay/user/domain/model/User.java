package com.razorpay.user.domain.model;

import com.razorpay.common.entity.BaseEntity;
import com.razorpay.common.enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Role role = Role.ROLE_MERCHANT;

    @Column(nullable = false)
    @Builder.Default
    private boolean enabled = true;

    // Optional merchant ID if associated with a merchant profile
    @Column(name = "merchant_id")
    private UUID merchantId;
}
