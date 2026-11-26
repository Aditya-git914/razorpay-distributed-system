package com.razorpay.merchant.domain.repository;

import com.razorpay.merchant.domain.model.ApiKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ApiKeyRepository extends JpaRepository<ApiKey, UUID> {
    List<ApiKey> findByMerchantIdAndActiveTrue(UUID merchantId);
    Optional<ApiKey> findByKeyIdAndActiveTrue(String keyId);
}
