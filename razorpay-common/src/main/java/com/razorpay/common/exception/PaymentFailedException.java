package com.razorpay.common.exception;

import org.springframework.http.HttpStatus;

public class PaymentFailedException extends ApiException {
    private final String errorCode;

    public PaymentFailedException(String message, String errorCode) {
        super(message, HttpStatus.PAYMENT_REQUIRED);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
