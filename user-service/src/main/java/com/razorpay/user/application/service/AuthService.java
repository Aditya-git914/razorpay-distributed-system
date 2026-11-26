package com.razorpay.user.application.service;

import com.razorpay.common.dto.AuthRequest;
import com.razorpay.common.dto.AuthResponse;
import com.razorpay.common.dto.UserDTO;
import com.razorpay.common.enums.Role;
import com.razorpay.common.exception.ApiException;
import com.razorpay.common.exception.ResourceNotFoundException;
import com.razorpay.common.exception.UnauthorizedException;
import com.razorpay.common.security.JwtUtils;
import com.razorpay.common.security.SecurityConstants;
import com.razorpay.user.domain.model.User;
import com.razorpay.user.domain.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @PostConstruct
    public void seedInitialUsers() {
        if (!userRepository.existsByEmail("admin@razorpay.clone")) {
            User admin = User.builder()
                    .email("admin@razorpay.clone")
                    .fullName("Razorpay System Admin")
                    .passwordHash(passwordEncoder.encode("Admin@12345"))
                    .phone("+919999999999")
                    .role(Role.ROLE_ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(admin);
            log.info("Default Admin seeded: admin@razorpay.clone");
        }

        if (!userRepository.existsByEmail("merchant@razorpay.clone")) {
            User demoMerchant = User.builder()
                    .email("merchant@razorpay.clone")
                    .fullName("Acme Corp Merchant")
                    .passwordHash(passwordEncoder.encode("Merchant@12345"))
                    .phone("+919876543210")
                    .role(Role.ROLE_MERCHANT)
                    .merchantId(UUID.fromString("11111111-1111-1111-1111-111111111111"))
                    .enabled(true)
                    .build();
            userRepository.save(demoMerchant);
            log.info("Default Merchant seeded: merchant@razorpay.clone");
        }
    }

    @Transactional
    public AuthResponse register(AuthRequest.Register request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ApiException("An account with email " + request.getEmail() + " already exists");
        }

        Role userRole = Role.ROLE_MERCHANT;
        if ("ADMIN".equalsIgnoreCase(request.getRole())) {
            userRole = Role.ROLE_ADMIN;
        } else if ("CUSTOMER".equalsIgnoreCase(request.getRole())) {
            userRole = Role.ROLE_CUSTOMER;
        }

        // Generate synthetic merchant ID for merchants
        UUID merchantId = (userRole == Role.ROLE_MERCHANT) ? UUID.randomUUID() : null;

        User user = User.builder()
                .email(request.getEmail().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(userRole)
                .merchantId(merchantId)
                .enabled(true)
                .build();

        user = userRepository.save(user);

        String token = jwtUtils.generateToken(user.getId(), user.getEmail(), user.getRole().name(), user.getMerchantId());
        String refreshToken = jwtUtils.generateRefreshToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(SecurityConstants.EXPIRATION_TIME)
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .merchantId(user.getMerchantId())
                .businessName(request.getBusinessName() != null ? request.getBusinessName() : user.getFullName() + " Store")
                .build();
    }

    public AuthResponse login(AuthRequest.Login request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials provided"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid credentials provided");
        }

        if (!user.isEnabled()) {
            throw new UnauthorizedException("Account is disabled. Please contact support.");
        }

        String token = jwtUtils.generateToken(user.getId(), user.getEmail(), user.getRole().name(), user.getMerchantId());
        String refreshToken = jwtUtils.generateRefreshToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(SecurityConstants.EXPIRATION_TIME)
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .merchantId(user.getMerchantId())
                .businessName(user.getFullName() + " Store")
                .build();
    }

    public UserDTO getUserProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole())
                .enabled(user.isEnabled())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
