package com.example.datn.exception;

import com.example.datn.config.ResponseHelper;
import com.example.datn.dto.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@ControllerAdvice
public class GlobalException {

    private static final String MIN_ATTRIBUTE = "min";

    // Xử lý Exception chung chưa được bắt
    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<ApiResponse> runtimeExceptionHandler(Exception e) {
        log.error("Unhandled exception caught by GlobalExceptionHandler: {}", e.getMessage(), e);
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setCode(ErrorCode.UNCATEGORIZED_EXCEPTION.getErrorCode());
        apiResponse.setMessage(ErrorCode.UNCATEGORIZED_EXCEPTION.getErrorMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
    }

    // Xử lý AppException tùy chỉnh
    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleAppException(AppException ex) {
        ErrorCode errorCode = ex.getErrorCode();
        log.error("AppException caught: Code={}, Message={}", errorCode.getErrorCode(), errorCode.getErrorMessage());
        Map<String, String> errors = new HashMap<>();
        errors.put("error", ex.getMessage());
        ApiResponse<Map<String, String>> apiResponse = ApiResponse.<Map<String, String>>builder()
                .code(errorCode.getErrorCode())
                .message(errorCode.getErrorMessage())
                .data(errors)
                .build();
        return ResponseEntity.status(errorCode.getHttpStatus()).body(apiResponse);
    }

    // Xử lý lỗi validate đầu vào
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ResponseHelper.error(HttpStatus.BAD_REQUEST, "Validation", errors));
    }
}