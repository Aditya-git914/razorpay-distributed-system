package com.razorpay.common.exception;

import org.springframework.http.HttpStatus;

public class IdempotencyException extends ApiException {
    public IdempotencyException(String message) {
        super(message, HttpStatus.CONFLICT);
    }
}
