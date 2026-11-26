package com.razorpay.common.idempotency;

import com.razorpay.common.exception.IdempotencyException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class IdempotencyAspect {

    private final IdempotencyService idempotencyService;

    @Around("@annotation(idempotent)")
    public Object handleIdempotency(ProceedingJoinPoint joinPoint, Idempotent idempotent) throws Throwable {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            return joinPoint.proceed();
        }

        HttpServletRequest request = attributes.getRequest();
        String idempotencyKey = request.getHeader(idempotent.headerName());

        if (idempotencyKey == null || idempotencyKey.isBlank()) {
            // If header is not passed, proceed normally
            return joinPoint.proceed();
        }

        // Check if result already cached
        Object cachedResult = idempotencyService.getResult(idempotencyKey, Object.class);
        if (cachedResult != null) {
            log.info("Returning cached idempotent response for key: {}", idempotencyKey);
            return cachedResult;
        }

        // Acquire lock
        boolean acquired = idempotencyService.tryAcquireLock(idempotencyKey, idempotent.ttlSeconds());
        if (!acquired) {
            log.warn("Concurrent duplicate request detected for idempotency key: {}", idempotencyKey);
            throw new IdempotencyException("A request with idempotency key '" + idempotencyKey + "' is already in progress.");
        }

        try {
            Object result = joinPoint.proceed();
            idempotencyService.saveResult(idempotencyKey, result, idempotent.ttlSeconds());
            return result;
        } finally {
            idempotencyService.releaseLock(idempotencyKey);
        }
    }
}
