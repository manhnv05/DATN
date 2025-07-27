package com.example.datn.VO.employee;


import com.example.datn.enums.Gender;
import com.example.datn.enums.Role;
import com.example.datn.validator.EnumSubset;
import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@ToString
public class EmployeeCreateRequest {
    //TODO: Xđ ảnh xem nên lưu như nào?
    @Schema(example = "null")
    String hinhAnh;

    @Size(max = 50, message = "Tên nhân viên tối đa 50 ký tự")
    @NotBlank(message = "Tên nhân viên không được để trống")
    @Schema(example = "Nguyễn Văn A")
    String hoVaTen;

    @Email(message = "Email không hợp lệ")
    @Pattern(regexp = "^[A-Za-z0-9+_.-]+@gmail\\.com$", message = "Email phải có định dạng @gmail.com")
    @Schema(example = "nguyen.van.a@gmail.com")
    String email;

    @Pattern(
            regexp = "^(0)(32|33|34|35|36|37|38|39|70|71|72|73|74|75|76|77|78|79|81|82|83|84|85|86|87|88|89|90|93|94|96|97|98|99)\\d{7}$",
            message = "Số điện thoại phải bắt đầu bằng đầu số hợp lệ (VD: 032, 083, 096...) và có đúng 10 chữ số"
    )
    @Schema(example = "0356789123")
    String soDienThoai;

    @NotNull(message = "Ngày sinh không được để trống")
    @Past(message = "Ngày sinh phải là ngày trong quá khứ")
    @JsonFormat(pattern = "dd/MM/yyyy")
    @Schema(example = "10/10/1990")
    LocalDate ngaySinh;
    @AssertTrue(message = "Độ tuổi phải từ 18 đến 60, vui lòng nhập lại ngày sinh hợp lệ.")
    boolean isBirthDateValid() {
        if (ngaySinh == null) return false;
        LocalDate maxDate = LocalDate.now().minusYears(60); // Tuổi tối đa 60 (sau 2007-07-17)
        LocalDate minDate = LocalDate.now().minusYears(18);  // Tuổi tối thiểu 18 (trc 1925-07-17))
        return (ngaySinh.isBefore(minDate) || ngaySinh.isEqual(minDate))
                && (ngaySinh.isAfter(maxDate) || ngaySinh.isEqual(maxDate));
    }

    @NotBlank(message = "Giới tính không được để trống")
    @EnumSubset(
            enumClass = Gender.class, anyOf = {"MALE", "FEMALE"},
            message = "Giới tính phải là MALE/FEMALE"
    )
    @Schema(example = "MALE")
    String gioiTinh;

    @NotBlank(message = "Giới tính không được để trống")
    @EnumSubset(enumClass = Role.class, anyOf = {"ADMIN", "EMPLOYEE"}
            , message = "Vai tro phải là ADMIN/EMPLOYEE"
    )
    @Schema(example = "ADMIN")
    String vaiTro;

    @NotBlank(message = "Địa chỉ không được để trống")
    @Schema(example = "Hà Nội")
    String diaChi;
    @Size(max = 12, min = 12, message = "CCCD phải có đúng 12 ký tự")
    @NotBlank(message = "CCCD không được để trống")
    @Schema(example = "012345678901")
    String canCuocCongDan;
}
