package com.razorpay.merchant.application.service;

import com.razorpay.common.dto.MerchantDTO;
import com.razorpay.common.enums.KycStatus;
import com.razorpay.common.exception.ResourceNotFoundException;
import com.razorpay.merchant.domain.model.ApiKey;
import com.razorpay.merchant.domain.model.Merchant;
import com.razorpay.merchant.domain.model.WebhookEndpoint;
import com.razorpay.merchant.domain.repository.ApiKeyRepository;
import com.razorpay.merchant.domain.repository.MerchantRepository;
import com.razorpay.merchant.domain.repository.WebhookEndpointRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class MerchantService {

    private final MerchantRepository merchantRepository;
    private final ApiKeyRepository apiKeyRepository;
    private final WebhookEndpointRepository webhookEndpointRepository;

    private static final String CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private final SecureRandom random = new SecureRandom();

    @PostConstruct
    public void seedDemoMerchant() {
        UUID demoMerchantId = UUID.fromString("11111111-1111-1111-1111-111111111111");
        if (merchantRepository.findById(demoMerchantId).isEmpty()) {
            Merchant merchant = Merchant.builder()
                    .userId(UUID.fromString("22222222-2222-2222-2222-222222222222"))
                    .businessName("Acme Online Store")
                    .businessType("E-Commerce & Retail")
                    .panNumber("ABCDE1234F")
                    .gstin("29ABCDE1234F1Z5")
                    .kycStatus(KycStatus.VERIFIED)
                    .bankAccountNumber("912010045678901")
                    .ifscCode("HDFC0001234")
                    .bankName("HDFC Bank Ltd")
                    .accountBalance(new BigDecimal("125840.50"))
                    .build();
            merchant.setId(demoMerchantId);
            merchantRepository.save(merchant);

            ApiKey testKey = ApiKey.builder()
                    .merchantId(demoMerchantId)
                    .keyId("rzp_test_8877AAbbCCddEE")
                    .keySecret("rzp_secret_9988776655443322")
                    .environment("TEST")
                    .active(true)
                    .build();
            apiKeyRepository.save(testKey);

            WebhookEndpoint webhook = WebhookEndpoint.builder()
                    .merchantId(demoMerchantId)
                    .url("https://merchant-store.com/api/webhooks/razorpay")
                    .secret("whsec_5544332211")
                    .events("payment.authorized,payment.captured,payment.failed,refund.processed")
                    .active(true)
                    .build();
            webhookEndpointRepository.save(webhook);

            log.info("Default Merchant & API Keys seeded successfully: rzp_test_8877AAbbCCddEE");
        }
    }

    public MerchantDTO getMerchantById(UUID merchantId) {
        Merchant merchant = merchantRepository.findById(merchantId)
                .orElseThrow(() -> new ResourceNotFoundException("Merchant", "id", merchantId));
        return mapToDTO(merchant);
    }

    public MerchantDTO getMerchantByUserId(UUID userId) {
        Merchant merchant = merchantRepository.findByUserId(userId)
                .orElseGet(() -> {
                    // Auto-provision merchant profile if not yet created
                    Merchant newMerchant = Merchant.builder()
                            .userId(userId)
                            .businessName("My Digital Store")
                            .businessType("Online Retail")
                            .kycStatus(KycStatus.VERIFIED)
                            .accountBalance(BigDecimal.ZERO)
                            .build();
                    newMerchant = merchantRepository.save(newMerchant);
                    generateApiKey(newMerchant.getId(), "TEST");
                    return newMerchant;
                });
        return mapToDTO(merchant);
    }

    @Transactional
    public MerchantDTO.ApiKeyResponse generateApiKey(UUID merchantId, String environment) {
        String env = (environment != null && environment.equalsIgnoreCase("LIVE")) ? "live" : "test";
        String keyId = "rzp_" + env + "_" + generateRandomString(14);
        String keySecret = "secret_" + generateRandomString(24);

        ApiKey key = ApiKey.builder()
                .merchantId(merchantId)
                .keyId(keyId)
                .keySecret(keySecret)
                .environment(env.toUpperCase())
                .active(true)
                .build();

        key = apiKeyRepository.save(key);

        return MerchantDTO.ApiKeyResponse.builder()
                .keyId(key.getKeyId())
                .keySecret(key.getKeySecret())
                .environment(key.getEnvironment())
                .active(key.isActive())
                .createdAt(key.getCreatedAt())
                .build();
    }

    public List<MerchantDTO.ApiKeyResponse> getActiveKeys(UUID merchantId) {
        return apiKeyRepository.findByMerchantIdAndActiveTrue(merchantId).stream()
                .map(k -> MerchantDTO.ApiKeyResponse.builder()
                        .keyId(k.getKeyId())
                        .keySecret(maskSecret(k.getKeySecret()))
                        .environment(k.getEnvironment())
                        .active(k.isActive())
                        .createdAt(k.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    public List<WebhookEndpoint> getWebhooks(UUID merchantId) {
        return webhookEndpointRepository.findByMerchantIdAndActiveTrue(merchantId);
    }

    @Transactional
    public WebhookEndpoint createWebhook(UUID merchantId, String url, String events) {
        WebhookEndpoint endpoint = WebhookEndpoint.builder()
                .merchantId(merchantId)
                .url(url)
                .secret("whsec_" + generateRandomString(16))
                .events(events != null ? events : "payment.authorized,payment.captured")
                .active(true)
                .build();
        return webhookEndpointRepository.save(endpoint);
    }

    private String generateRandomString(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(CHARS.charAt(random.nextInt(CHARS.length())));
        }
        return sb.toString();
    }

    private String maskSecret(String secret) {
        if (secret == null || secret.length() < 8) return "••••••••";
        return secret.substring(0, 4) + "••••••••" + secret.substring(secret.length() - 4);
    }

    private MerchantDTO mapToDTO(Merchant m) {
        return MerchantDTO.builder()
                .id(m.getId())
                .userId(m.getUserId())
                .businessName(m.getBusinessName())
                .businessType(m.getBusinessType())
                .panNumber(m.getPanNumber())
                .gstin(m.getGstin())
                .kycStatus(m.getKycStatus())
                .bankAccountNumber(m.getBankAccountNumber())
                .ifscCode(m.getIfscCode())
                .bankName(m.getBankName())
                .accountBalance(m.getAccountBalance())
                .createdAt(m.getCreatedAt())
                .build();
    }
}
