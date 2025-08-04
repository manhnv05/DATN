package com.example.datn.vo.khachHangVO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.sql.Date;



@Data
public class KhachHangVO {

    @NotBlank(message = "Mã khách hàng không để trống")
    private String maKhachHang;

    private String matKhau;

    @NotBlank(message = "Tên khách hàng không để trống")
    private String tenKhachHang;

    @Email(message = "Email không đúng định dạng")
    @NotBlank(message = "Mail không để trống")
    private String email;

    private Integer gioiTinh;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(
            regexp = "^(0[3|5|7|8|9])+([0-9]{8})$",
            message = "Số điện thoại không hợp lệ"
    )
    private String sdt;

    private Date ngaySinh;

    private String hinhAnh;

    private Integer trangThai;

}
