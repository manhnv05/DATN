package com.example.datn.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import java.io.Serializable;
import java.sql.Date;
import java.util.List;

@Entity
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "phieu_giam_gia")
public class PhieuGiamGia{

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ma_phieu_giam_gia")
    private String maPhieuGiamGia;

    @Column(name = "dieu_kien_giam")
    private String dieuKienGiam;

    @Column(name = "ten_phieu")
    private String tenPhieu;

    @Column(name = "loai_phieu")
    private String loaiPhieu;

    @Column(name = "pham_tram_giam_gia")
    private Integer phamTramGiamGia;

    @Column(name = "so_tien_giam")
    private Integer soTienGiam;

    @Column(name = "giam_toi_da")
    private Integer giamToiDa;

    @Column(name = "ngay_bat_dau")
    private Date ngayBatDau;

    @Column(name = "ngay_ket_thuc")
    private Date ngayKetThuc;

    @Column(name = "ngay_tao")
    private Date ngayTao;

    @Column(name = "ngay_cap_nhat")
    private Date ngayCapNhat;

    @Column(name = "ghi_chu")
    private String ghiChu;

    @Column(name = "trang_thai")
    private Integer trangThai;

    @OneToMany(mappedBy = "phieuGiamGia")
    private List<ChiTietPhieuGiamGia> chiTietPhieuGiamGias;

    @OneToMany(mappedBy = "phieuGiamGia")
    private List<HoaDon> hoaDons;
}