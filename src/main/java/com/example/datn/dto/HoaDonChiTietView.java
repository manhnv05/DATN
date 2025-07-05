package com.example.datn.dto;

public interface HoaDonChiTietView {
    // Các trường từ HoaDonChiTiet
    Integer getId();
    Integer getSoLuong();
    Integer getGia();
    Integer getThanhTien();
    String getGhiChu();
    Boolean getTrangThai();

    // Các trường join từ các bảng khác
    String getMaSanPhamChiTiet();
    String getTenSanPham();
    String getTenMauSac();
    String getTenKichThuoc();
    String getDuongDanAnh();
}
