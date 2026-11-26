package com.razorpay.transaction.infrastructure.messaging;

import com.razorpay.common.event.PaymentCompletedEvent;
import com.razorpay.common.event.PaymentFailedEvent;
import com.razorpay.common.event.RefundProcessedEvent;
import com.razorpay.common.event.SettlementCompletedEvent;
import com.razorpay.transaction.domain.model.TransactionRecord;
import com.razorpay.transaction.domain.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.time.Instant;

@Component
@Slf4j
@RequiredArgsConstructor
public class TransactionEventConsumer {

    private final TransactionRepository transactionRepository;
    private final SecureRandom random = new SecureRandom();

    @KafkaListener(topics = "payment.completed", groupId = "transaction-service-group")
    public void handlePaymentCompleted(PaymentCompletedEvent event) {
        log.info("Recording payment.completed in ledger for payment: {}", event.getPaymentId());

        TransactionRecord record = TransactionRecord.builder()
                .txnReference("txn_" + event.getPaymentId().replace("pay_", ""))
                .paymentId(event.getPaymentId())
                .orderId(event.getOrderId())
                .merchantId(event.getMerchantId())
                .amount(event.getAmount())
                .fee(event.getFee())
                .tax(event.getTax())
                .netAmount(event.getNetAmount())
                .type("PAYMENT")
                .status("SUCCESS")
                .method(event.getMethod() != null ? event.getMethod().name() : "UPI")
                .customerEmail(event.getCustomerEmail())
                .timestamp(event.getTimestamp() != null ? event.getTimestamp() : Instant.now())
                .build();

        transactionRepository.save(record);
    }

    @KafkaListener(topics = "payment.failed", groupId = "transaction-service-group")
    public void handlePaymentFailed(PaymentFailedEvent event) {
        log.info("Recording payment.failed in ledger for payment: {}", event.getPaymentId());

        TransactionRecord record = TransactionRecord.builder()
                .txnReference("txn_fail_" + event.getPaymentId().replace("pay_", ""))
                .paymentId(event.getPaymentId())
                .orderId(event.getOrderId())
                .merchantId(event.getMerchantId())
                .amount(event.getAmount())
                .type("PAYMENT")
                .status("FAILED")
                .method(event.getMethod() != null ? event.getMethod().name() : "UNKNOWN")
                .customerEmail(event.getCustomerEmail())
                .timestamp(event.getTimestamp() != null ? event.getTimestamp() : Instant.now())
                .build();

        transactionRepository.save(record);
    }

    @KafkaListener(topics = "refund.processed", groupId = "transaction-service-group")
    public void handleRefundProcessed(RefundProcessedEvent event) {
        log.info("Recording refund.processed in ledger for refund: {}", event.getRefundId());

        TransactionRecord record = TransactionRecord.builder()
                .txnReference("txn_rfnd_" + event.getRefundId().replace("rfnd_", ""))
                .paymentId(event.getPaymentId())
                .merchantId(event.getMerchantId())
                .amount(event.getAmount().negate()) // negative impact on ledger
                .type("REFUND")
                .status("SUCCESS")
                .timestamp(event.getTimestamp() != null ? event.getTimestamp() : Instant.now())
                .build();

        transactionRepository.save(record);
    }

    @KafkaListener(topics = "settlement.completed", groupId = "transaction-service-group")
    public void handleSettlementCompleted(SettlementCompletedEvent event) {
        log.info("Recording settlement.completed in ledger for settlement: {}", event.getSettlementId());

        TransactionRecord record = TransactionRecord.builder()
                .txnReference("txn_setl_" + event.getSettlementId().replace("setl_", ""))
                .merchantId(event.getMerchantId())
                .amount(event.getNetAmount())
                .type("SETTLEMENT")
                .status("SUCCESS")
                .timestamp(event.getTimestamp() != null ? event.getTimestamp() : Instant.now())
                .build();

        transactionRepository.save(record);
    }
}
