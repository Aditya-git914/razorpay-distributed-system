package com.razorpay.notification.infrastructure.messaging;

import com.razorpay.common.event.PaymentCompletedEvent;
import com.razorpay.common.event.PaymentFailedEvent;
import com.razorpay.common.event.SettlementCompletedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@Slf4j
@RequiredArgsConstructor
public class NotificationConsumer {

    private final SimpMessagingTemplate messagingTemplate;

    @KafkaListener(topics = "payment.completed", groupId = "notification-service-group")
    public void onPaymentCompleted(PaymentCompletedEvent event) {
        log.info("Processing notification for completed payment: {}", event.getPaymentId());

        Map<String, Object> payload = Map.of(
                "event", "PAYMENT_SUCCESS",
                "paymentId", event.getPaymentId(),
                "orderId", event.getOrderId(),
                "amount", event.getAmount(),
                "currency", event.getCurrency(),
                "method", event.getMethod() != null ? event.getMethod().name() : "UPI",
                "bankReference", event.getBankReference() != null ? event.getBankReference() : "",
                "timestamp", event.getTimestamp().toString()
        );

        // 1. Push to Live Checkout WebSocket Topic
        String checkoutTopic = "/topic/payments/" + event.getOrderId();
        messagingTemplate.convertAndSend(checkoutTopic, payload);
        log.info("WebSocket push sent to {}", checkoutTopic);

        // 2. Push to Merchant Dashboard WebSocket Topic
        String merchantTopic = "/topic/merchant/" + event.getMerchantId();
        messagingTemplate.convertAndSend(merchantTopic, payload);
        log.info("WebSocket push sent to {}", merchantTopic);

        // 3. Simulate Email Dispatch
        if (event.getCustomerEmail() != null) {
            simulateEmailDispatch(event.getCustomerEmail(),
                    "Payment Successful: ₹" + event.getAmount() + " for Order " + event.getOrderId(),
                    "Dear Customer,\n\nYour payment of ₹" + event.getAmount() + " (" + event.getPaymentId() +
                            ") was successful.\nBank Ref: " + event.getBankReference() + "\n\nThank you for paying with Razorpay.");
        }

        // 4. Simulate SMS Dispatch
        if (event.getCustomerPhone() != null) {
            simulateSmsDispatch(event.getCustomerPhone(),
                    "Paid ₹" + event.getAmount() + " successfully via Razorpay (ID: " + event.getPaymentId() + ").");
        }
    }

    @KafkaListener(topics = "payment.failed", groupId = "notification-service-group")
    public void onPaymentFailed(PaymentFailedEvent event) {
        log.warn("Processing notification for failed payment: {}", event.getPaymentId());

        Map<String, Object> payload = Map.of(
                "event", "PAYMENT_FAILED",
                "paymentId", event.getPaymentId(),
                "orderId", event.getOrderId(),
                "errorCode", event.getErrorCode() != null ? event.getErrorCode() : "PAYMENT_FAILED",
                "errorDescription", event.getErrorDescription() != null ? event.getErrorDescription() : "Transaction declined"
        );

        String checkoutTopic = "/topic/payments/" + event.getOrderId();
        messagingTemplate.convertAndSend(checkoutTopic, payload);
    }

    @KafkaListener(topics = "settlement.completed", groupId = "notification-service-group")
    public void onSettlementCompleted(SettlementCompletedEvent event) {
        log.info("Processing notification for settlement: {}", event.getSettlementId());

        Map<String, Object> payload = Map.of(
                "event", "SETTLEMENT_PROCESSED",
                "settlementId", event.getSettlementId(),
                "netAmount", event.getNetAmount(),
                "utrNumber", event.getUtrNumber() != null ? event.getUtrNumber() : "",
                "status", event.getStatus()
        );

        String merchantTopic = "/topic/merchant/" + event.getMerchantId();
        messagingTemplate.convertAndSend(merchantTopic, payload);
    }

    private void simulateEmailDispatch(String to, String subject, String body) {
        log.info("[EMAIL SENT] To: {} | Subject: {} | Body snippet: {}", to, subject, body.substring(0, Math.min(body.length(), 60)) + "...");
    }

    private void simulateSmsDispatch(String phone, String text) {
        log.info("[SMS SENT] To: {} | Message: {}", phone, text);
    }
}
