package com.example.datn.utils;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PasswordGenerator {

    static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#";
    static final int PASSWORD_LENGTH = 10;
    public static String generatePassword() {
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder(PASSWORD_LENGTH);

        for (int i = 0; i < PASSWORD_LENGTH; i++) {
            int index = random.nextInt(CHARACTERS.length());
            password.append(CHARACTERS.charAt(index));
        }
        return password.toString();
        //T9z@fKL01#@#
    }
}
