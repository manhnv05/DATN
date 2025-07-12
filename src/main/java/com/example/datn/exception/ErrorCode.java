package com.example.datn.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    // General & User
    USER_EXISTED(1002, "User already existed", HttpStatus.INTERNAL_SERVER_ERROR),
    UNCATEGORIZED_EXCEPTION(9999, "UNCATEGORIZED_EXCEPTION", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003, "USERNAME MUST BE AT LEAST {min} characters", HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1004, "PASSWORD MUST BE AT LEAST {min} characters", HttpStatus.BAD_REQUEST),
    VALIDATION_ERROR(1008, "VALIDATION_ERROR", HttpStatus.BAD_REQUEST),
    INVALID_DOB(1009, "Your must be at least {min}", HttpStatus.BAD_REQUEST),

    // Product/Customer/Order
    INSUFFICIENT_QUANTITY(1001, "Số lượng yêu cầu vượt quá số lượng tồn kho", HttpStatus.BAD_REQUEST),
    PRODUCT_NOT_FOUND(1010, "Sản phẩm không tồn tại", HttpStatus.BAD_REQUEST),
    CUSTOMER_NOT_FOUND(1011, "Khách hàng không tồn tại", HttpStatus.BAD_REQUEST),
    EMPLOYEE_NOT_FOUND(1011, "Nhân viên không tồn tại", HttpStatus.BAD_REQUEST),
    ORDER_NOT_FOUND(1005, "Hóa đơn không tồn tại", HttpStatus.NOT_FOUND),
    NO_STATUS_CHANGE(1006, "Trạng thái hóa đơn không thay đổi", HttpStatus.BAD_REQUEST),
    NO_PREVIOUS_STATUS(1006, "Không có trạng thái trước đó để thay đổi", HttpStatus.BAD_REQUEST),
    INVALID_STATUS_TRANSITION(1007, "Chuyển đổi trạng thái không hợp lệ", HttpStatus.BAD_REQUEST),
    ORDER_HAS_BEEN_CANCELLED(1008, "Đơn hàng đã hủy", HttpStatus.BAD_REQUEST),
    INVALID_STATUS(1009, "Trạng thái hóa đơn không đúng", HttpStatus.BAD_REQUEST),
    NOT_YET_PAID(1012, "Chưa thanh toán", HttpStatus.BAD_REQUEST),

    // Voucher/Discount (from sd_17)
    PHIEU_GIAM_GIA_NULL(2001, "Phiếu Giảm Giá Không Tồn tại", HttpStatus.NOT_FOUND),
    PHIEU_GIAM_GIA_KHACH_HANG_NOT_FOUND(2002, "Phiếu giảm giá khách hàng không tồn tại", HttpStatus.BAD_REQUEST),
    MAIL_ERROR(2003, "ERROR MAIL", HttpStatus.BAD_REQUEST);

    private final int errorCode;
    private final String errorMessage;
    private final HttpStatus httpStatus;

    ErrorCode(int errorCode, String errorMessage, HttpStatus httpStatus) {
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
        this.httpStatus = httpStatus;
    }

    // Overload for enums without errorCode (for compatibility)
    ErrorCode(HttpStatus status, String message) {
        this.errorCode = -1;
        this.errorMessage = message;
        this.httpStatus = status;
    }

    public String getErrorMessage(Object... args) {
        return String.format(errorMessage, args);
    }
}