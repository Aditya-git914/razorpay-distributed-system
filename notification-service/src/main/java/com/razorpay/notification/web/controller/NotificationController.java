package com.razorpay.notification.web.controller;

import com.razorpay.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping("/broadcast")
    public ResponseEntity<ApiResponse<String>> broadcastTest(
            @RequestParam String topic,
            @RequestBody Map<String, Object> payload) {
        messagingTemplate.convertAndSend(topic, payload);
        return ResponseEntity.ok(ApiResponse.ok("Broadcast dispatched to " + topic, "OK"));
    }
}
