package com.example.datn.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@RestController
public class ProvinceProxyController {

    @GetMapping("/api/vietnamlabs/province")
    public ResponseEntity<?> getVietnamLabsProvinces() {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "https://vietnamlabs.com/api/vietnamprovince";  // <-- ĐÚNG URL
            Object res = restTemplate.getForObject(url, Object.class);
            return ResponseEntity.ok(res);
        } catch (RestClientException e) {
            return ResponseEntity.status(502).body("Không thể lấy dữ liệu từ vietnamlabs: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi server: " + e.getMessage());
        }
    }
}