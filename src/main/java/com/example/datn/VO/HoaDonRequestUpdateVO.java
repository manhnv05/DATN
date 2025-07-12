package com.example.datn.VO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HoaDonRequestUpdateVO {
    private Integer idHoaDon;
    private String nhanVien;
    private String khachHang;
    private String phieuGiamGia;
    private BigDecimal tongTien;
    private BigDecimal tongTienBanDau;
    private BigDecimal tongHoaDon;
    private String phuongThucThanhToan;
    private String tenKhachHang;
    private String sdt;
    private String diaChi;
    private String ghiChu;
}
