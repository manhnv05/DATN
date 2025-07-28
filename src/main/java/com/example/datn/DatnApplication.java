package com.example.datn;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class DatnApplication {

    public static void main(String[] args) {
        SpringApplication.run(DatnApplication.class, args);
    }

}
