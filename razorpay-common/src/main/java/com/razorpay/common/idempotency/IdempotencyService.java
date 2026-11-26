package com.razorpay.common.idempotency;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class IdempotencyService {

    private final Optional<StringRedisTemplate> redisTemplate;
    private final ObjectMapper objectMapper;

    private static final String LOCK_PREFIX = "idemp:lock:";
    private static final String RESULT_PREFIX = "idemp:result:";

    public boolean tryAcquireLock(String key, long ttlSeconds) {
        if (redisTemplate.isEmpty()) {
            return true; // gracefully pass through if Redis is disabled
        }
        try {
            Boolean acquired = redisTemplate.get()
                    .opsForValue()
                    .setIfAbsent(LOCK_PREFIX + key, "LOCKED", Duration.ofSeconds(ttlSeconds));
            return Boolean.TRUE.equals(acquired);
        } catch (Exception e) {
            log.warn("Redis unavailable for idempotency lock acquisition: {}", e.getMessage());
            return true;
        }
    }

    public void releaseLock(String key) {
        if (redisTemplate.isEmpty()) return;
        try {
            redisTemplate.get().delete(LOCK_PREFIX + key);
        } catch (Exception e) {
            log.warn("Redis error releasing lock: {}", e.getMessage());
        }
    }

    public void saveResult(String key, Object result, long ttlSeconds) {
        if (redisTemplate.isEmpty()) return;
        try {
            String json = objectMapper.writeValueAsString(result);
            redisTemplate.get()
                    .opsForValue()
                    .set(RESULT_PREFIX + key, json, Duration.ofSeconds(ttlSeconds));
        } catch (Exception e) {
            log.warn("Failed to cache idempotency result: {}", e.getMessage());
        }
    }

    public <T> T getResult(String key, Class<T> clazz) {
        if (redisTemplate.isEmpty()) return null;
        try {
            String json = redisTemplate.get().opsForValue().get(RESULT_PREFIX + key);
            if (json != null) {
                return objectMapper.readValue(json, clazz);
            }
        } catch (Exception e) {
            log.warn("Failed to fetch idempotency result: {}", e.getMessage());
        }
        return null;
    }
}
