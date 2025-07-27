package com.example.datn.VO.employee;

import com.example.datn.enums.TrangThai;
import com.example.datn.validator.EnumSubset;
import io.swagger.v3.oas.annotations.media.Schema;
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
public class EmployeeUpdateRequest extends EmployeeCreateRequest{
    @NotBlank(message = "Trạng thái không được để trống")
    @EnumSubset(enumClass = TrangThai.class, anyOf = {"ACTIVE", "INACTIVE"})
    @Schema(example = "INACTIVE")
    String trangThai;
}
