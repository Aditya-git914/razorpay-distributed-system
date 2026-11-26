package com.razorpay.payment.application.service;

import com.razorpay.common.dto.OrderDTO;
import com.razorpay.common.dto.PaymentDTO;
import com.razorpay.common.dto.ProcessPaymentRequest;
import com.razorpay.common.dto.RefundDTO;
import com.razorpay.common.enums.OrderStatus;
import com.razorpay.common.enums.PaymentMethod;
import com.razorpay.common.enums.PaymentStatus;
import com.razorpay.common.enums.RefundStatus;
import com.razorpay.common.event.PaymentCompletedEvent;
import com.razorpay.common.event.PaymentCreatedEvent;
import com.razorpay.common.event.PaymentFailedEvent;
import com.razorpay.common.event.RefundProcessedEvent;
import com.razorpay.common.exception.ApiException;
import com.razorpay.common.exception.PaymentFailedException;
import com.razorpay.common.exception.ResourceNotFoundException;
import com.razorpay.payment.domain.model.Order;
import com.razorpay.payment.domain.model.Payment;
import com.razorpay.payment.domain.model.Refund;
import com.razorpay.payment.domain.repository.OrderRepository;
import com.razorpay.payment.domain.repository.PaymentRepository;
import com.razorpay.payment.domain.repository.RefundRepository;
import com.razorpay.payment.infrastructure.messaging.PaymentEventProducer;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final RefundRepository refundRepository;
    private final PaymentEventProducer eventProducer;

    private static final BigDecimal GATEWAY_FEE_RATE = new BigDecimal("0.02"); // 2%
    private static final BigDecimal GST_RATE = new BigDecimal("0.18"); // 18% GST on fee

    private static final String CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    private final SecureRandom random = new SecureRandom();

    @PostConstruct
    public void seedInitialDemoData() {
        UUID demoMerchantId = UUID.fromString("11111111-1111-1111-1111-111111111111");
        if (orderRepository.findByMerchantIdOrderByCreatedAtDesc(demoMerchantId).isEmpty()) {
            // Seed a few demo orders and payments for immediate visual feedback
            Order order1 = Order.builder()
                    .orderId("order_demo1001")
                    .merchantId(demoMerchantId)
                    .amount(new BigDecimal("2499.00"))
                    .currency("INR")
                    .receipt("rcpt_1001")
                    .status(OrderStatus.PAID)
                    .description("Nike Air Pegasus Sneakers")
                    .customerEmail("rahul.sharma@example.com")
                    .customerPhone("+919876500001")
                    .build();
            orderRepository.save(order1);

            Payment payment1 = Payment.builder()
                    .paymentId("pay_demo1001")
                    .orderId("order_demo1001")
                    .merchantId(demoMerchantId)
                    .amount(new BigDecimal("2499.00"))
                    .fee(new BigDecimal("49.98"))
                    .tax(new BigDecimal("9.00"))
                    .netAmount(new BigDecimal("2440.02"))
                    .currency("INR")
                    .status(PaymentStatus.CAPTURED)
                    .method(PaymentMethod.UPI)
                    .bankReference("UPI/429182910283")
                    .vpa("rahul@okhdfcbank")
                    .customerEmail("rahul.sharma@example.com")
                    .customerPhone("+919876500001")
                    .fraudRiskScore(8)
                    .build();
            paymentRepository.save(payment1);

            Order order2 = Order.builder()
                    .orderId("order_demo1002")
                    .merchantId(demoMerchantId)
                    .amount(new BigDecimal("14500.00"))
                    .currency("INR")
                    .receipt("rcpt_1002")
                    .status(OrderStatus.PAID)
                    .description("Sony WH-1000XM5 Headphones")
                    .customerEmail("priya.patel@example.com")
                    .customerPhone("+919876500002")
                    .build();
            orderRepository.save(order2);

            Payment payment2 = Payment.builder()
                    .paymentId("pay_demo1002")
                    .orderId("order_demo1002")
                    .merchantId(demoMerchantId)
                    .amount(new BigDecimal("14500.00"))
                    .fee(new BigDecimal("290.00"))
                    .tax(new BigDecimal("52.20"))
                    .netAmount(new BigDecimal("14157.80"))
                    .currency("INR")
                    .status(PaymentStatus.CAPTURED)
                    .method(PaymentMethod.CARD)
                    .bankReference("CARD/83910294821")
                    .cardLast4("4242")
                    .cardNetwork("VISA")
                    .customerEmail("priya.patel@example.com")
                    .customerPhone("+919876500002")
                    .fraudRiskScore(14)
                    .build();
            paymentRepository.save(payment2);

            log.info("Demo orders & payments seeded for merchant: {}", demoMerchantId);
        }
    }

    @Transactional
    public OrderDTO createOrder(BigDecimal amount, String currency, String receipt, String description, UUID merchantId) {
        String orderId = "order_" + generateRandomString(14);
        Order order = Order.builder()
                .orderId(orderId)
                .merchantId(merchantId)
                .amount(amount)
                .currency(currency != null ? currency : "INR")
                .receipt(receipt != null ? receipt : "rcpt_" + generateRandomString(8))
                .description(description)
                .status(OrderStatus.CREATED)
                .build();

        order = orderRepository.save(order);
        return mapOrderToDTO(order);
    }

    public OrderDTO getOrderByOrderId(String orderId) {
        Order order = orderRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderId", orderId));
        return mapOrderToDTO(order);
    }

    public List<OrderDTO> getOrdersByMerchant(UUID merchantId) {
        return orderRepository.findByMerchantIdOrderByCreatedAtDesc(merchantId).stream()
                .map(this::mapOrderToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public PaymentDTO processPayment(ProcessPaymentRequest request, UUID merchantIdOverride) {
        Order order = orderRepository.findByOrderId(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderId", request.getOrderId()));

        UUID merchantId = merchantIdOverride != null ? merchantIdOverride : order.getMerchantId();

        // Check if order already paid
        if (order.getStatus() == OrderStatus.PAID) {
            throw new ApiException("Order " + request.getOrderId() + " is already paid");
        }

        String paymentId = "pay_" + generateRandomString(14);

        // Calculate Fee & GST
        BigDecimal amount = request.getAmount() != null ? request.getAmount() : order.getAmount();
        BigDecimal fee = amount.multiply(GATEWAY_FEE_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal tax = fee.multiply(GST_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal netAmount = amount.subtract(fee).subtract(tax);

        // Publish Created Event
        eventProducer.publishPaymentCreated(PaymentCreatedEvent.builder()
                .paymentId(paymentId)
                .orderId(order.getOrderId())
                .merchantId(merchantId)
                .amount(amount)
                .currency(order.getCurrency())
                .method(request.getMethod())
                .customerEmail(request.getCustomerEmail())
                .customerPhone(request.getCustomerPhone())
                .build());

        // Check test failure simulation trigger (e.g., amount == 99999 or card == 0000 0000 0000 0000)
        boolean simulateFailure = isSimulatedFailure(request);
        if (simulateFailure) {
            Payment failedPayment = Payment.builder()
                    .paymentId(paymentId)
                    .orderId(order.getOrderId())
                    .merchantId(merchantId)
                    .amount(amount)
                    .currency(order.getCurrency())
                    .status(PaymentStatus.FAILED)
                    .method(request.getMethod())
                    .errorCode("BAD_REQUEST_PAYMENT_DECLINED")
                    .errorDescription("Your card or payment was declined by the issuing bank")
                    .customerEmail(request.getCustomerEmail())
                    .customerPhone(request.getCustomerPhone())
                    .fraudRiskScore(92)
                    .build();
            paymentRepository.save(failedPayment);

            eventProducer.publishPaymentFailed(PaymentFailedEvent.builder()
                    .paymentId(paymentId)
                    .orderId(order.getOrderId())
                    .merchantId(merchantId)
                    .amount(amount)
                    .method(request.getMethod())
                    .errorCode("BAD_REQUEST_PAYMENT_DECLINED")
                    .errorDescription("Payment declined by issuing bank")
                    .customerEmail(request.getCustomerEmail())
                    .build());

            throw new PaymentFailedException("Payment was declined by issuing bank simulation", "BAD_REQUEST_PAYMENT_DECLINED");
        }

        // Simulate successful payment details based on method
        String bankRef = null;
        String cardLast4 = null;
        String cardNetwork = null;
        String vpa = request.getVpa();

        switch (request.getMethod()) {
            case UPI:
                bankRef = "UPI/" + (100000000000L + random.nextLong(899999999999L));
                if (vpa == null || vpa.isBlank()) vpa = "customer@upi";
                break;
            case CARD:
                bankRef = "CARD/" + (1000000000L + random.nextLong(8999999999L));
                String rawCard = request.getCardNumber() != null ? request.getCardNumber().replaceAll("\\s+", "") : "4242424242424242";
                cardLast4 = rawCard.length() >= 4 ? rawCard.substring(rawCard.length() - 4) : "4242";
                cardNetwork = detectCardNetwork(rawCard);
                break;
            case NETBANKING:
                String bank = request.getBankCode() != null ? request.getBankCode().toUpperCase() : "HDFC";
                bankRef = "NETB/" + bank + "/" + (10000000 + random.nextInt(89999999));
                break;
            case QR:
                bankRef = "QR/" + (1000000000L + random.nextLong(8999999999L));
                vpa = "rzp.qr@icici";
                break;
            case WALLET:
                bankRef = "WALLET/" + (10000000 + random.nextInt(89999999));
                break;
        }

        int simulatedRisk = random.nextInt(25); // Safe low-risk baseline

        Payment payment = Payment.builder()
                .paymentId(paymentId)
                .orderId(order.getOrderId())
                .merchantId(merchantId)
                .amount(amount)
                .fee(fee)
                .tax(tax)
                .netAmount(netAmount)
                .currency(order.getCurrency())
                .status(PaymentStatus.CAPTURED)
                .method(request.getMethod())
                .bankReference(bankRef)
                .vpa(vpa)
                .cardLast4(cardLast4)
                .cardNetwork(cardNetwork)
                .customerEmail(request.getCustomerEmail())
                .customerPhone(request.getCustomerPhone())
                .fraudRiskScore(simulatedRisk)
                .build();

        payment = paymentRepository.save(payment);

        // Mark order as PAID
        order.setStatus(OrderStatus.PAID);
        orderRepository.save(order);

        // Publish Completed Event
        eventProducer.publishPaymentCompleted(PaymentCompletedEvent.builder()
                .paymentId(payment.getPaymentId())
                .orderId(order.getOrderId())
                .merchantId(merchantId)
                .amount(payment.getAmount())
                .fee(payment.getFee())
                .tax(payment.getTax())
                .netAmount(payment.getNetAmount())
                .currency(payment.getCurrency())
                .method(payment.getMethod())
                .bankReference(payment.getBankReference())
                .customerEmail(payment.getCustomerEmail())
                .customerPhone(payment.getCustomerPhone())
                .build());

        return mapPaymentToDTO(payment);
    }

    @Transactional
    public RefundDTO createRefund(String paymentId, BigDecimal refundAmount, String reason, UUID merchantId) {
        Payment payment = paymentRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "paymentId", paymentId));

        if (payment.getStatus() != PaymentStatus.CAPTURED) {
            throw new ApiException("Only CAPTURED payments can be refunded. Current status: " + payment.getStatus());
        }

        BigDecimal amount = refundAmount != null ? refundAmount : payment.getAmount();
        if (amount.compareTo(payment.getAmount()) > 0) {
            throw new ApiException("Refund amount cannot exceed payment amount: " + payment.getAmount());
        }

        String refundId = "rfnd_" + generateRandomString(14);
        Refund refund = Refund.builder()
                .refundId(refundId)
                .paymentId(payment.getPaymentId())
                .merchantId(merchantId != null ? merchantId : payment.getMerchantId())
                .amount(amount)
                .reason(reason != null ? reason : "Customer requested cancellation")
                .status(RefundStatus.PROCESSED)
                .build();

        refund = refundRepository.save(refund);

        payment.setStatus(PaymentStatus.REFUNDED);
        paymentRepository.save(payment);

        eventProducer.publishRefundProcessed(RefundProcessedEvent.builder()
                .refundId(refund.getRefundId())
                .paymentId(payment.getPaymentId())
                .merchantId(refund.getMerchantId())
                .amount(refund.getAmount())
                .reason(refund.getReason())
                .status(refund.getStatus().name())
                .build());

        return mapRefundToDTO(refund);
    }

    public List<PaymentDTO> getPaymentsByMerchant(UUID merchantId) {
        return paymentRepository.findByMerchantIdOrderByCreatedAtDesc(merchantId).stream()
                .map(this::mapPaymentToDTO)
                .collect(Collectors.toList());
    }

    public PaymentDTO getPaymentById(String paymentId) {
        Payment payment = paymentRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "paymentId", paymentId));
        return mapPaymentToDTO(payment);
    }

    public List<RefundDTO> getRefundsByMerchant(UUID merchantId) {
        return refundRepository.findByMerchantIdOrderByCreatedAtDesc(merchantId).stream()
                .map(this::mapRefundToDTO)
                .collect(Collectors.toList());
    }

    private boolean isSimulatedFailure(ProcessPaymentRequest req) {
        if (req.getCardNumber() != null && req.getCardNumber().replaceAll("\\s+", "").startsWith("0000")) {
            return true;
        }
        return false;
    }

    private String detectCardNetwork(String cardNumber) {
        if (cardNumber.startsWith("4")) return "VISA";
        if (cardNumber.startsWith("5")) return "MASTERCARD";
        if (cardNumber.startsWith("6") || cardNumber.startsWith("8")) return "RUPAY";
        return "VISA";
    }

    private String generateRandomString(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(CHARS.charAt(random.nextInt(CHARS.length())));
        }
        return sb.toString();
    }

    private OrderDTO mapOrderToDTO(Order o) {
        return OrderDTO.builder()
                .id(o.getId())
                .orderId(o.getOrderId())
                .merchantId(o.getMerchantId())
                .amount(o.getAmount())
                .currency(o.getCurrency())
                .receipt(o.getReceipt())
                .status(o.getStatus())
                .createdAt(o.getCreatedAt())
                .build();
    }

    private PaymentDTO mapPaymentToDTO(Payment p) {
        return PaymentDTO.builder()
                .id(p.getId())
                .paymentId(p.getPaymentId())
                .orderId(p.getOrderId())
                .merchantId(p.getMerchantId())
                .amount(p.getAmount())
                .fee(p.getFee())
                .tax(p.getTax())
                .currency(p.getCurrency())
                .status(p.getStatus())
                .method(p.getMethod())
                .bankReference(p.getBankReference())
                .vpa(p.getVpa())
                .cardLast4(p.getCardLast4())
                .cardNetwork(p.getCardNetwork())
                .customerEmail(p.getCustomerEmail())
                .customerPhone(p.getCustomerPhone())
                .errorCode(p.getErrorCode())
                .errorDescription(p.getErrorDescription())
                .createdAt(p.getCreatedAt())
                .build();
    }

    private RefundDTO mapRefundToDTO(Refund r) {
        return RefundDTO.builder()
                .id(r.getId())
                .refundId(r.getRefundId())
                .paymentId(r.getPaymentId())
                .amount(r.getAmount())
                .status(r.getStatus())
                .reason(r.getReason())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
