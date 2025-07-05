package com.example.datn.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "phieu_giam_gia")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PhieuGiamGia {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @Column(name = "ma_phieu_giam_gia")
    String maPhieuGiamGia;

    @Column(name = "dieu_kien_giam")
    String dieuKienGiam;

    @Column(name = "ten_phieu")
    String tenPhieu;

    @Column(name = "loai_phieu")
    int loaiPhieu;

    @Column(name = "pham_tram_giam_gia")
    BigDecimal phamTramGiamGia;

    @Column(name = "so_tien_giam")
    BigDecimal soTienGiam;

    @Column(name = "giam_toi_da")
    BigDecimal giamToiDa;

    @Column(name = "ngay_bat_dau")
    LocalDateTime ngayBatDau;

    @Column(name = "ngay_ket_thuc")
    LocalDateTime ngayKetThuc;

    @Column(name = "ngay_tao")
    LocalDateTime ngayTao;

    @Column(name = "ngay_cap_nhat")
    LocalDateTime ngayCapNhat;

    @Column(name = "ghi_chu")
    String ghiChu;

    @Column(name = "trang_thai")
    int trangThai;

    @Column(name = "so_luong")
    BigDecimal soLuong;
}
