package com.example.datn.VO.customer;

import com.example.datn.enums.TrangThai;
import com.example.datn.validator.EnumSubset;
import jakarta.validation.constraints.NotBlank;
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
public class CustomerUpdateRequest extends CustomerCreateRequest{
    @NotBlank(message = "Trạng thái không được để trống")
    @EnumSubset(enumClass = TrangThai.class, anyOf = {"ACTIVE", "INACTIVE"}, message = "Trạng thái phải là ACTIVE/INACTIVE")
    String trangThai;
}
