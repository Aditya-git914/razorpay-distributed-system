package com.razorpay.common.dto;

import com.razorpay.common.enums.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcessPaymentRequest {
    @NotBlank(message = "Order ID is mandatory")
    private String orderId;

    @NotNull(message = "Amount is mandatory")
    private BigDecimal amount;

    @Builder.Default
    private String currency = "INR";

    @NotNull(message = "Payment method is mandatory")
    private PaymentMethod method;

    // Optional UPI Details
    private String vpa;

    // Optional Card Details
    private String cardNumber;
    private String cardExpiry;
    private String cardCvv;
    private String cardHolderName;

    // Optional Netbanking Details
    private String bankCode;

    // Customer details
    private String customerEmail;
    private String customerPhone;
    private String customerName;

    // Wallet / Customer ID if using wallet
    private String walletId;
}
