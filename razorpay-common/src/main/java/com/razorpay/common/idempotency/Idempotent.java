package com.razorpay.common.idempotency;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Idempotent {
    /**
     * Header name containing the idempotency key.
     */
    String headerName() default "Idempotency-Key";

    /**
     * Time-to-live for the idempotency record in seconds.
     */
    long ttlSeconds() default 120;
}
