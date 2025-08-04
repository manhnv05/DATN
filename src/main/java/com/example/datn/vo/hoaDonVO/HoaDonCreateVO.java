package com.example.datn.vo.hoaDonVO;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HoaDonCreateVO {
    // Thông tin khách hàng / nhân viên
    private Integer idKhachHang;
    private Integer idNhanVien;

    // Loại hóa đơn (ví dụ: "tai_quay", "online")
    private String loaiHoaDon;

    // Thông tin giao hàng (chỉ cần thiết cho hóa đơn online hoặc tại quầy có giao hàng)
    @Pattern(regexp = "^(0|84)?([0-9]{9,10})$", message = "Số điện thoại không hợp lệ")
    private String sdt;
    private String diaChi;


    private String ghiChu;

    // Danh sách các sản phẩm trong hóa đơn
    // QUAN TRỌNG: Đây phải là List của HoaDonChiTietRequest, không phải HoaDonChiTiet entity
    @NotEmpty(message = "Hóa đơn phải có ít nhất một sản phẩm chi tiết") // List không được rỗng
    @Valid // Đảm bảo rằng từng đối tượng HoaDonChiTietRequest trong danh sách cũng được validate
    private List<HoaDonChiTietVO> hoaDonChiTiet;
}
