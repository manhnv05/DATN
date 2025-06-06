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
@Table(name = "hoa_don")
public class HoaDon{

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_nhan_vien")
    private NhanVien nhanVien;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_khach_hang")
    private KhachHang khachHang;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_phieu_giam_gia")
    private PhieuGiamGia phieuGiamGia;

    @Column(name = "ma_hoa_don")
    private String maHoaDon;

    @Column(name = "ngay_tao")
    private Date ngayTao;

    @Column(name = "tong_tien")
    private Integer tongTien;

    @Column(name = "giam_gia")
    private Integer giamGia;

    @Column(name = "tong_tien_ban_dau")
    private Integer tongTienBanDau;

    @Column(name = "phi_van_chuyen")
    private Integer phiVanChuyen;

    @Column(name = "tong_tien_hoa_don")
    private Integer tongTienHoaDon;

    @Column(name = "ten_khach_hang")
    private String tenKhachHang;

    @Column(name = "ngay_dat")
    private Date ngayDat;

    @Column(name = "ngay_giao_du_kien")
    private Date ngayGiaoDuKien;

    @Column(name = "sdt")
    private String sdt;

    @Column(name = "dia_chi")
    private String diaChi;

    @Column(name = "ghi_chu")
    private String ghiChu;

    @Column(name = "trang_thai")
    private Integer trangThai;

    @OneToMany(mappedBy = "hoaDon")
    private List<HoaDonChiTiet> hoaDonChiTiets;
}