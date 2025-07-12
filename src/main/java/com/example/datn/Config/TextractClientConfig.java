//package com.example.datn.Config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.beans.factory.annotation.Autowired;
//import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
//import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
//import software.amazon.awssdk.regions.Region;
//import software.amazon.awssdk.services.textract.TextractClient;
//
//@Configuration
//public class TextractClientConfig {
//    @Autowired
//    private AwsConfig awsConfig;
//
//    @Bean
//    public TextractClient textractClient() {
//        return TextractClient.builder()
//                .credentialsProvider(
//                        StaticCredentialsProvider.create(
//                                AwsBasicCredentials.create(awsConfig.getAccessKey(), awsConfig.getSecretKey())
//                        )
//                )
//                .region(Region.of(awsConfig.getRegion()))
//                .build();
//    }
//}