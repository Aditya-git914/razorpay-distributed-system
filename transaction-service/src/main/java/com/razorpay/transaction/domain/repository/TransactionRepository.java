package com.razorpay.transaction.domain.repository;

import com.razorpay.transaction.domain.model.TransactionRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<TransactionRecord, UUID> {

    Optional<TransactionRecord> findByTxnReference(String txnReference);

    List<TransactionRecord> findByMerchantIdOrderByTimestampDesc(UUID merchantId);

    @Query("SELECT COUNT(t) FROM TransactionRecord t WHERE t.merchantId = :merchantId")
    long countByMerchantId(@Param("merchantId") UUID merchantId);

    @Query("SELECT COUNT(t) FROM TransactionRecord t WHERE t.merchantId = :merchantId AND t.status = 'SUCCESS'")
    long countSuccessfulByMerchantId(@Param("merchantId") UUID merchantId);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM TransactionRecord t WHERE t.merchantId = :merchantId AND t.status = 'SUCCESS'")
    BigDecimal sumGrossAmountByMerchantId(@Param("merchantId") UUID merchantId);

    @Query("SELECT COALESCE(SUM(t.netAmount), 0) FROM TransactionRecord t WHERE t.merchantId = :merchantId AND t.status = 'SUCCESS'")
    BigDecimal sumNetAmountByMerchantId(@Param("merchantId") UUID merchantId);

    @Query("SELECT COALESCE(SUM(t.fee), 0) FROM TransactionRecord t WHERE t.merchantId = :merchantId AND t.status = 'SUCCESS'")
    BigDecimal sumFeesByMerchantId(@Param("merchantId") UUID merchantId);
}
