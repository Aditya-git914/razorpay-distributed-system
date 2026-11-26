package com.razorpay.payment.infrastructure.messaging;

import com.razorpay.common.event.PaymentCompletedEvent;
import com.razorpay.common.event.PaymentCreatedEvent;
import com.razorpay.common.event.PaymentFailedEvent;
import com.razorpay.common.event.RefundProcessedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@Slf4j
@RequiredArgsConstructor
public class PaymentEventProducer {

    private final Optional<KafkaTemplate<String, Object>> kafkaTemplate;

    public static final String TOPIC_PAYMENT_CREATED = "payment.created";
    public static final String TOPIC_PAYMENT_COMPLETED = "payment.completed";
    public static final String TOPIC_PAYMENT_FAILED = "payment.failed";
    public static final String TOPIC_REFUND_PROCESSED = "refund.processed";

    public void publishPaymentCreated(PaymentCreatedEvent event) {
        publish(TOPIC_PAYMENT_CREATED, event.getPaymentId(), event);
    }

    public void publishPaymentCompleted(PaymentCompletedEvent event) {
        publish(TOPIC_PAYMENT_COMPLETED, event.getPaymentId(), event);
    }

    public void publishPaymentFailed(PaymentFailedEvent event) {
        publish(TOPIC_PAYMENT_FAILED, event.getPaymentId(), event);
    }

    public void publishRefundProcessed(RefundProcessedEvent event) {
        publish(TOPIC_REFUND_PROCESSED, event.getRefundId(), event);
    }

    private void publish(String topic, String key, Object payload) {
        if (kafkaTemplate.isEmpty()) {
            log.info("[Event Emitted (Local Mock)] Topic: {} | Key: {} | Payload: {}", topic, key, payload.getClass().getSimpleName());
            return;
        }
        try {
            kafkaTemplate.get().send(topic, key, payload)
                    .whenComplete((result, ex) -> {
                        if (ex == null) {
                            log.info("Successfully produced event to {} with key {}", topic, key);
                        } else {
                            log.warn("Failed to deliver message to Kafka topic {}: {}", topic, ex.getMessage());
                        }
                    });
        } catch (Exception e) {
            log.warn("Kafka broker unreachable. Event logged locally: {} | {}", topic, e.getMessage());
        }
    }
}
