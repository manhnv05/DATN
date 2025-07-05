package com.example.datn.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "aws")
public class AwsConfig {
    private String accessKey;
    private String secretKey;
    private String region;

    public AwsConfig() {
    }

    public AwsConfig(String accessKey, String secretKey, String region) {
        this.accessKey = accessKey;
        this.secretKey = secretKey;
        this.region = region;
    }

    public String getAccessKey() {
        return accessKey;
    }

    public void setAccessKey(String accessKey) {
        this.accessKey = accessKey;
    }

    public String getSecretKey() {
        return secretKey;
    }

    public void setSecretKey(String secretKey) {
        this.secretKey = secretKey;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    @Override
    public String toString() {
        return "AwsConfig{" +
                "accessKey='" + accessKey + '\'' +
                ", secretKey='" + (secretKey == null ? null : "****") + '\'' +
                ", region='" + region + '\'' +
                '}';
    }
}