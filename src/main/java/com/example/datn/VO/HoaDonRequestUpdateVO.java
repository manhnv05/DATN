package com.example.datn.VO;

import com.example.datn.enums.TrangThai;
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

    private String idNhanVien;

    private String idKhachHang;

    private String idPhieuGiamGia;

    private BigDecimal tongTien;

    private BigDecimal tongTienBanDau;

    private BigDecimal tongHoaDon;

    private String tenKhachHang;

    private LocalDateTime ngayDat;

    private LocalDateTime ngayGiaoDuKien;

    private String sdt;

    private String diaChi;

    private String ghiChu;
}
