package com.example.datn.Entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import com.example.datn.enums.TrangThai;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@Table(name = "hoa_don")
public class HoaDon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    LocalDateTime ngayTao;

    @ManyToOne
    @JoinColumn(name = "id_khach_hang")
    KhachHang khachHang;

    @ManyToOne
    @JoinColumn(name = "id_nhan_vien")
    NhanVien nhanVien;

    @ManyToOne
    @JoinColumn(name = "id_phieu_giam_gia")
    PhieuGiamGia phieuGiamGia;

    @Column(name = "dia_chi")
    String diaChi;

    @Column(name = "ghi_chu")
    String ghiChu;

    @Column(name = "trang_thai")
    TrangThai trangThai;
    @Column(name = "ngay_giao_du_kien")
    LocalDateTime ngayGiaoDuKien;

    @Column(name = "sdt")
    String sdt;
    @Column(name = "tong_tien")
    Integer tongTien;

    @Column(name = "tong_tien_ban_dau")
    Integer tongTienBanDau;

    @Column(name = "phi_van_chuyen")
    Integer phiVanChuyen;

    @Column(name = "tong_hoa_don")
    Integer tongHoaDon;

    @Column(name = "ten_khach_hang")
    String tenKhachHang;
    @Column(name = "loai_hoa_don")
    String loaiHoaDon;
    @Column(name = "ma_hoa_don")
    String maHoaDon;
    @OneToMany(mappedBy = "hoaDon", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HoaDonChiTiet> hoaDonChiTietList;


}
