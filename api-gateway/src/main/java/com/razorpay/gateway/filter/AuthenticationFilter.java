package com.razorpay.gateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
@Slf4j
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

    private final SecretKey secretKey;

    private static final List<String> OPEN_ENDPOINTS = List.of(
            "/api/v1/auth/login",
            "/api/v1/auth/signin",
            "/api/v1/auth/register",
            "/api/v1/auth/signup",
            "/api/v1/auth/refresh",
            "/api/v1/auth/logout",
            "/api/v1/payments/process",
            "/api/v1/payments/public/",
            "/api/v1/orders/public/",
            "/ws",
            "/actuator",
            "/fallback"
    );

    public AuthenticationFilter(@Value("${jwt.secret:razorpay_distributed_secret_key_needs_to_be_at_least_256_bits_long_for_hmac_sha256_security}") String secret) {
        super(Config.class);
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            String path = request.getURI().getPath();

            // Allow open endpoints
            if (isOpenEndpoint(path)) {
                return chain.filter(exchange);
            }

            // Check Authorization Header
            if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                return onError(exchange, "Missing Authorization Header", HttpStatus.UNAUTHORIZED);
            }

            String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return onError(exchange, "Invalid Authorization Header format", HttpStatus.UNAUTHORIZED);
            }

            String token = authHeader.substring(7);

            try {
                Claims claims = Jwts.parser()
                        .verifyWith(secretKey)
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();

                // Propagate user metadata downstream via request headers
                ServerHttpRequest.Builder mutatedRequestBuilder = request.mutate();

                if (claims.get("userId") != null) {
                    mutatedRequestBuilder.header("X-User-Id", claims.get("userId", String.class));
                }
                if (claims.getSubject() != null) {
                    mutatedRequestBuilder.header("X-User-Email", claims.getSubject());
                }
                if (claims.get("role") != null) {
                    mutatedRequestBuilder.header("X-User-Role", claims.get("role", String.class));
                }
                if (claims.get("merchantId") != null) {
                    mutatedRequestBuilder.header("X-Merchant-Id", claims.get("merchantId", String.class));
                }

                ServerHttpRequest mutatedRequest = mutatedRequestBuilder.build();
                return chain.filter(exchange.mutate().request(mutatedRequest).build());

            } catch (Exception e) {
                log.error("JWT validation failure for path {}: {}", path, e.getMessage());
                return onError(exchange, "Unauthorized: " + e.getMessage(), HttpStatus.UNAUTHORIZED);
            }
        };
    }

    private boolean isOpenEndpoint(String path) {
        return OPEN_ENDPOINTS.stream().anyMatch(path::startsWith);
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        response.getHeaders().add("Content-Type", "application/json");
        String body = String.format("{\"success\":false,\"message\":\"%s\",\"status\":%d}", err, httpStatus.value());
        return response.writeWith(Mono.just(response.bufferFactory().wrap(body.getBytes(StandardCharsets.UTF_8))));
    }

    public static class Config {
        // configuration properties if needed
    }
}
