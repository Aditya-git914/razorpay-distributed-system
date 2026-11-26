package com.razorpay.user.web.controller;

import com.razorpay.common.dto.ApiResponse;
import com.razorpay.common.dto.UserDTO;
import com.razorpay.common.security.SecurityConstants;
import com.razorpay.user.application.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDTO>> getCurrentUser(
            @RequestHeader(SecurityConstants.X_USER_ID) String userIdStr) {
        UUID userId = UUID.fromString(userIdStr);
        UserDTO user = authService.getUserProfile(userId);
        return ResponseEntity.ok(ApiResponse.ok(user));
    }
}
