package com.example.datn.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.example.datn.enums.TrangThai;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class HoaDonDTO {
    private Integer id;
    private LocalDateTime ngayTao;
    private LocalDateTime ngayGiaoDuKien;
    private TrangThai trangThai;
    private String ghiChu;
    private String maHoaDon;
    private String tenKhachHang;
    private String sdt;
    private String diaChi;
    private String tenSanPham;
    private String maNhanVien;
    private String tenNhanVien;

    private String loaiHoaDon;
    private List<HoaDonChiTietDTO> danhSachChiTiet;

    private Double tongTienBanDau;   // Tổng tiền trước khi giảm giá
    private Double tongTien;         // Tổng sau giảm giá, chưa bao gồm phí vận chuyển
    private Double phiVanChuyen;     // Phí vận chuyển
    private Double tongHoaDon;       // Tổng
}
