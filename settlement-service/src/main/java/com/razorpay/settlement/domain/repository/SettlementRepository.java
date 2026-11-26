package com.razorpay.settlement.domain.repository;

import com.razorpay.settlement.domain.model.Settlement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SettlementRepository extends JpaRepository<Settlement, UUID> {
    Optional<Settlement> findBySettlementId(String settlementId);
    List<Settlement> findByMerchantIdOrderByCreatedAtDesc(UUID merchantId);
}
