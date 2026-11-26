package com.razorpay.settlement.application.service;

import com.razorpay.common.dto.SettlementDTO;
import com.razorpay.common.enums.SettlementStatus;
import com.razorpay.common.event.SettlementCompletedEvent;
import com.razorpay.common.exception.ResourceNotFoundException;
import com.razorpay.settlement.domain.model.Settlement;
import com.razorpay.settlement.domain.repository.SettlementRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class SettlementService {

    private final SettlementRepository settlementRepository;
    private final Optional<KafkaTemplate<String, Object>> kafkaTemplate;
    private final SecureRandom random = new SecureRandom();

    private static final String CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    @PostConstruct
    public void seedInitialSettlements() {
        UUID demoMerchantId = UUID.fromString("11111111-1111-1111-1111-111111111111");
        if (settlementRepository.findByMerchantIdOrderByCreatedAtDesc(demoMerchantId).isEmpty()) {
            Settlement s1 = Settlement.builder()
                    .settlementId("setl_9918237192")
                    .merchantId(demoMerchantId)
                    .grossAmount(new BigDecimal("128450.00"))
                    .feesDeducted(new BigDecimal("2569.00"))
                    .taxDeducted(new BigDecimal("462.42"))
                    .netAmount(new BigDecimal("125418.58"))
                    .status(SettlementStatus.SETTLED)
                    .utrNumber("UTR" + (100000000000L + random.nextLong(899999999999L)))
                    .settledAt(Instant.now().minus(1, ChronoUnit.DAYS))
                    .build();
            settlementRepository.save(s1);

            Settlement s2 = Settlement.builder()
                    .settlementId("setl_9918237193")
                    .merchantId(demoMerchantId)
                    .grossAmount(new BigDecimal("94200.00"))
                    .feesDeducted(new BigDecimal("1884.00"))
                    .taxDeducted(new BigDecimal("339.12"))
                    .netAmount(new BigDecimal("91976.88"))
                    .status(SettlementStatus.SETTLED)
                    .utrNumber("UTR" + (100000000000L + random.nextLong(899999999999L)))
                    .settledAt(Instant.now().minus(3, ChronoUnit.DAYS))
                    .build();
            settlementRepository.save(s2);

            log.info("Initial settlements seeded for merchant: {}", demoMerchantId);
        }
    }

    public List<SettlementDTO> getMerchantSettlements(UUID merchantId) {
        return settlementRepository.findByMerchantIdOrderByCreatedAtDesc(merchantId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public SettlementDTO triggerInstantSettlement(UUID merchantId, BigDecimal requestedAmount) {
        BigDecimal gross = (requestedAmount != null && requestedAmount.compareTo(BigDecimal.ZERO) > 0)
                ? requestedAmount
                : new BigDecimal("35000.00");

        BigDecimal fee = gross.multiply(new BigDecimal("0.02"));
        BigDecimal tax = fee.multiply(new BigDecimal("0.18"));
        BigDecimal net = gross.subtract(fee).subtract(tax);

        String settlementId = "setl_" + generateRandomString(14);
        String utr = "UTR" + (100000000000L + random.nextLong(899999999999L));

        Settlement settlement = Settlement.builder()
                .settlementId(settlementId)
                .merchantId(merchantId)
                .grossAmount(gross)
                .feesDeducted(fee)
                .taxDeducted(tax)
                .netAmount(net)
                .status(SettlementStatus.SETTLED)
                .utrNumber(utr)
                .settledAt(Instant.now())
                .build();

        settlement = settlementRepository.save(settlement);

        // Publish Settlement Completed Event
        SettlementCompletedEvent event = SettlementCompletedEvent.builder()
                .settlementId(settlement.getSettlementId())
                .merchantId(settlement.getMerchantId())
                .grossAmount(settlement.getGrossAmount())
                .netAmount(settlement.getNetAmount())
                .utrNumber(settlement.getUtrNumber())
                .status(settlement.getStatus().name())
                .timestamp(Instant.now())
                .build();

        if (kafkaTemplate.isPresent()) {
            try {
                kafkaTemplate.get().send("settlement.completed", settlement.getSettlementId(), event);
            } catch (Exception e) {
                log.warn("Kafka notification skipped for settlement: {}", e.getMessage());
            }
        }

        return mapToDTO(settlement);
    }

    private String generateRandomString(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(CHARS.charAt(random.nextInt(CHARS.length())));
        }
        return sb.toString();
    }

    private SettlementDTO mapToDTO(Settlement s) {
        return SettlementDTO.builder()
                .id(s.getId())
                .settlementId(s.getSettlementId())
                .merchantId(s.getMerchantId())
                .grossAmount(s.getGrossAmount())
                .feesDeducted(s.getFeesDeducted())
                .taxDeducted(s.getTaxDeducted())
                .netAmount(s.getNetAmount())
                .status(s.getStatus())
                .utrNumber(s.getUtrNumber())
                .settledAt(s.getSettledAt())
                .createdAt(s.getCreatedAt())
                .build();
    }
}
