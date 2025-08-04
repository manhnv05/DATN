package com.example.datn.vo.nhanVienVO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.sql.Date;


@Data
public class NhanVienVO {

    private Integer idVaiTro;

    @NotBlank(message = "Mã nhân viên không để trống")
    private String maNhanVien;

    @NotBlank(message = "Họ Và Tên Không để trống")
    private String hoVaTen;

//    @NotBlank(message = "Chưa chọn ảnh của nhân viên")
    private String hinhAnh;

    @NotBlank(message = "Giới tính không để trống")
    private String gioiTinh;

    private Date ngaySinh;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(
            regexp = "^(0[3|5|7|8|9])+([0-9]{8})$",
            message = "Số điện thoại không hợp lệ"
    )
    private String soDienThoai;

    private String canCuocCongDan;

    @Email(message = "Email không đúng định dạng")
    @NotBlank(message = "Mail không để trống")
    private String email;

    private String diaChi;

    private String matKhau;

    private Integer trangThai;

}
