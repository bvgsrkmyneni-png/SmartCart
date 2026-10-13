package com.klu.ecommerce_backend.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klu.ecommerce_backend.dto.PaymentVerifyRequest;
import com.klu.ecommerce_backend.service.PaymentService;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create/{orderId}")
    public ResponseEntity<Map<String, Object>> createPayment(
            @org.springframework.web.bind.annotation.PathVariable Long orderId)
            throws Exception {

        return ResponseEntity.ok(
                paymentService.createRazorpayOrder(orderId)
        );
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyPayment(
            @RequestBody PaymentVerifyRequest request)
            throws Exception {

        boolean verified =
                paymentService.verifyPayment(request);

        if (verified) {
            return ResponseEntity.ok(
                    "Payment verified successfully"
            );
        }

        return ResponseEntity.badRequest()
                .body("Payment verification failed");
    }

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(
            @RequestBody String payload,
            @RequestHeader("X-Razorpay-Signature")
            String signature)
            throws Exception {

        paymentService.processWebhook(
                payload,
                signature
        );

        return ResponseEntity.ok(
                "Webhook processed successfully"
        );
    }
}