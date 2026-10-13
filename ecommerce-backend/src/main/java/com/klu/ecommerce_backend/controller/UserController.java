package com.klu.ecommerce_backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klu.ecommerce_backend.dto.AuthResponse;
import com.klu.ecommerce_backend.dto.SigninRequest;
import com.klu.ecommerce_backend.dto.SignupRequest;
import com.klu.ecommerce_backend.service.UserService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(
            @RequestBody SignupRequest request) {

        String response = userService.signup(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(
            @RequestBody SigninRequest request) {

        AuthResponse response = userService.signin(request);

        if (response == null) {
            return ResponseEntity
                    .badRequest()
                    .body("Invalid Email or Password");
        }

        return ResponseEntity.ok(response);
    }
}