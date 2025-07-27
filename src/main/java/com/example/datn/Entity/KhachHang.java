package com.example.datn.Entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.sql.Date;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "khach_hang")
public class KhachHang{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;
    @Column(name = "hinh_anh")
    String hinhAnh;

    @Column(name = "ma_khach_hang")
    String maKhachHang;
    @Column(name = "ten_khach_hang")
    String tenKhachHang;

    @Column(name = "email")
    String email;

    @Column(name = "sdt")
    String sdt;

    @Column(name = "ngay_sinh")
    Date ngaySinh;
    @Column(name = "gioi_tinh")
    String gioiTinh;

    @OneToMany(mappedBy = "khachHang" , cascade = {CascadeType.PERSIST}, orphanRemoval = true)
    List<DiaChi> diaChis;
    @Column(name = "trang_thai")
    String trangThai;
    @Column(name = "mat_khau")
    String matKhau;

    @OneToMany(mappedBy = "khachHang")
    List<HoaDon> hoaDons;
    @OneToMany(mappedBy = "khachHang")
    List<ChiTietPhieuGiamGia> chiTietPhieuGiamGias;
}