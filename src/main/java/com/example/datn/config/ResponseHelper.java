package com.example.datn.config;

import com.example.datn.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;
import java.util.Map;

public class ResponseHelper {

    /**
     * Trả về lỗi có kèm theo map lỗi chi tiết (thường dùng cho validate form)
     */
    public static ApiResponse<Object> error(HttpStatus status, String message, Map<String, String> dataErrors) {
        return new ApiResponse<>(
                status.value(),
                dataErrors,
                message,
                LocalDateTime.now().toString(),
                true,
                null
        );
    }

    /**
     * Trả về thành công với dữ liệu content
     */
    public static <T> ResponseEntity<ApiResponse<T>> success(String message, T content) {
        ApiResponse<T> apiResponse = new ApiResponse<>(
                HttpStatus.OK.value(),
                null,
                message,
                LocalDateTime.now().toString(),
                false,
                content
        );
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    /**
     * Trả về lỗi đơn giản chỉ có message lỗi, không kèm map lỗi chi tiết
     */
    public static ResponseEntity<ApiResponse<String>> error(String message) {
        ApiResponse<String> apiResponse = new ApiResponse<>(
                HttpStatus.BAD_REQUEST.value(),
                null,
                message,
                LocalDateTime.now().toString(),
                true,
                null
        );
        return new ResponseEntity<>(apiResponse, HttpStatus.BAD_REQUEST);
    }
}