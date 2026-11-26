package com.razorpay.common.security;

public final class SecurityConstants {
    private SecurityConstants() {}

    public static final String TOKEN_PREFIX = "Bearer ";
    public static final String HEADER_STRING = "Authorization";
    public static final String DEFAULT_SECRET = "razorpay_distributed_secret_key_needs_to_be_at_least_256_bits_long_for_hmac_sha256_security";
    public static final long EXPIRATION_TIME = 86_400_000L; // 24 hours
    public static final long REFRESH_EXPIRATION_TIME = 604_800_000L; // 7 days

    // Custom HTTP Header keys for gateway-forwarded contexts
    public static final String X_USER_ID = "X-User-Id";
    public static final String X_USER_EMAIL = "X-User-Email";
    public static final String X_USER_ROLE = "X-User-Role";
    public static final String X_MERCHANT_ID = "X-Merchant-Id";
}
