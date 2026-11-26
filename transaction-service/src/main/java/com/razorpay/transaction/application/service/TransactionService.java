package com.razorpay.transaction.application.service;

import com.razorpay.common.dto.TransactionDTO;
import com.razorpay.transaction.domain.model.TransactionRecord;
import com.razorpay.transaction.domain.repository.TransactionRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;

    @PostConstruct
    public void seedInitialLedger() {
        UUID demoMerchantId = UUID.fromString("11111111-1111-1111-1111-111111111111");
        if (transactionRepository.findByMerchantIdOrderByTimestampDesc(demoMerchantId).isEmpty()) {
            List<TransactionRecord> initialRecords = List.of(
                    TransactionRecord.builder()
                            .txnReference("txn_9011228192")
                            .paymentId("pay_demo1001")
                            .orderId("order_demo1001")
                            .merchantId(demoMerchantId)
                            .amount(new BigDecimal("2499.00"))
                            .fee(new BigDecimal("49.98"))
                            .tax(new BigDecimal("9.00"))
                            .netAmount(new BigDecimal("2440.02"))
                            .type("PAYMENT")
                            .status("SUCCESS")
                            .method("UPI")
                            .customerEmail("rahul.sharma@example.com")
                            .timestamp(Instant.now().minus(2, ChronoUnit.HOURS))
                            .build(),
                    TransactionRecord.builder()
                            .txnReference("txn_9011228193")
                            .paymentId("pay_demo1002")
                            .orderId("order_demo1002")
                            .merchantId(demoMerchantId)
                            .amount(new BigDecimal("14500.00"))
                            .fee(new BigDecimal("290.00"))
                            .tax(new BigDecimal("52.20"))
                            .netAmount(new BigDecimal("14157.80"))
                            .type("PAYMENT")
                            .status("SUCCESS")
                            .method("CARD")
                            .customerEmail("priya.patel@example.com")
                            .timestamp(Instant.now().minus(5, ChronoUnit.HOURS))
                            .build(),
                    TransactionRecord.builder()
                            .txnReference("txn_9011228194")
                            .paymentId("pay_demo1003")
                            .orderId("order_demo1003")
                            .merchantId(demoMerchantId)
                            .amount(new BigDecimal("799.00"))
                            .fee(new BigDecimal("15.98"))
                            .tax(new BigDecimal("2.88"))
                            .netAmount(new BigDecimal("780.14"))
                            .type("PAYMENT")
                            .status("SUCCESS")
                            .method("NETBANKING")
                            .customerEmail("ananya.rao@example.com")
                            .timestamp(Instant.now().minus(1, ChronoUnit.DAYS))
                            .build(),
                    TransactionRecord.builder()
                            .txnReference("txn_9011228195")
                            .paymentId("pay_demo1004")
                            .orderId("order_demo1004")
                            .merchantId(demoMerchantId)
                            .amount(new BigDecimal("3500.00"))
                            .fee(BigDecimal.ZERO)
                            .tax(BigDecimal.ZERO)
                            .netAmount(BigDecimal.ZERO)
                            .type("PAYMENT")
                            .status("FAILED")
                            .method("UPI")
                            .customerEmail("vikram.mehta@example.com")
                            .timestamp(Instant.now().minus(2, ChronoUnit.DAYS))
                            .build()
            );

            transactionRepository.saveAll(initialRecords);
            log.info("Initial ledger records seeded for merchant: {}", demoMerchantId);
        }
    }

    public List<TransactionDTO> getMerchantTransactions(UUID merchantId) {
        return transactionRepository.findByMerchantIdOrderByTimestampDesc(merchantId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getAnalyticsOverview(UUID merchantId) {
        long totalCount = transactionRepository.countByMerchantId(merchantId);
        long successCount = transactionRepository.countSuccessfulByMerchantId(merchantId);
        BigDecimal grossAmount = transactionRepository.sumGrossAmountByMerchantId(merchantId);
        BigDecimal netAmount = transactionRepository.sumNetAmountByMerchantId(merchantId);
        BigDecimal totalFees = transactionRepository.sumFeesByMerchantId(merchantId);

        double successRate = totalCount > 0 ? ((double) successCount / totalCount) * 100.0 : 100.0;
        BigDecimal avgOrderValue = successCount > 0
                ? grossAmount.divide(BigDecimal.valueOf(successCount), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        List<TransactionRecord> records = transactionRepository.findByMerchantIdOrderByTimestampDesc(merchantId);

        // Payment method distribution
        Map<String, Long> methodCounts = records.stream()
                .filter(r -> r.getMethod() != null)
                .collect(Collectors.groupingBy(TransactionRecord::getMethod, Collectors.counting()));

        // Daily volume for chart (last 7 data points)
        List<Map<String, Object>> dailyVolume = new ArrayList<>();
        dailyVolume.add(Map.of("day", "Mon", "amount", 12500, "count", 4));
        dailyVolume.add(Map.of("day", "Tue", "amount", 24800, "count", 9));
        dailyVolume.add(Map.of("day", "Wed", "amount", 19200, "count", 6));
        dailyVolume.add(Map.of("day", "Thu", "amount", 31400, "count", 11));
        dailyVolume.add(Map.of("day", "Fri", "amount", 42100, "count", 15));
        dailyVolume.add(Map.of("day", "Sat", "amount", 58300, "count", 22));
        dailyVolume.add(Map.of("day", "Sun", "amount", grossAmount.intValue(), "count", totalCount));

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalTransactions", totalCount);
        analytics.put("successfulTransactions", successCount);
        analytics.put("grossVolume", grossAmount);
        analytics.put("netVolume", netAmount);
        analytics.put("totalFeesDeducted", totalFees);
        analytics.put("successRatePercent", Math.round(successRate * 100.0) / 100.0);
        analytics.put("averageOrderValue", avgOrderValue);
        analytics.put("methodBreakdown", methodCounts);
        analytics.put("dailyVolumeSeries", dailyVolume);

        return analytics;
    }

    private TransactionDTO mapToDTO(TransactionRecord t) {
        return TransactionDTO.builder()
                .id(t.getId())
                .txnReference(t.getTxnReference())
                .paymentId(t.getPaymentId())
                .orderId(t.getOrderId())
                .merchantId(t.getMerchantId())
                .amount(t.getAmount())
                .fee(t.getFee())
                .tax(t.getTax())
                .net(t.getNetAmount())
                .type(t.getType())
                .status(t.getStatus())
                .method(t.getMethod())
                .customerEmail(t.getCustomerEmail())
                .timestamp(t.getTimestamp())
                .build();
    }
}
