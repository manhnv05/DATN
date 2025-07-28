package com.example.datn.VO.customer;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@ToString
public class CustomerDuplicateCheckRequest {
    
    @Email(message = "Email không hợp lệ")
    @Pattern(regexp = "^[A-Za-z0-9+_.-]+@gmail\\.com$", message = "Email phải có định dạng @gmail.com")
    @Schema(example = "nguyen.van.a@gmail.com")
    String email;

    @Pattern(
            regexp = "^(0)(3[2-9]|5[6,8,9]|7[0,6-9]|8[1-9]|9[0-9])\\d{7}$",
            message = "Số điện thoại phải bắt đầu bằng đầu số hợp lệ (VD: 032, 083, 096...) và có đúng 10 chữ số"
    )
    @Schema(example = "0356789123")
    String sdt;

    @Schema(description = "Id khách hàng (dùng cho update, để loại trừ chính mình khi check trùng)")
    Integer id;
} 