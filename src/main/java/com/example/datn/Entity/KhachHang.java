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
@Table(name = "khach_hang")
public class KhachHang{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "ma_khach_hang")
    private String maKhachHang;
    @Column(name = "ten_khach_hang")
    private String tenKhachHang;
    @Column(name = "gioi_tinh")
    private Integer gioiTinh;
    @Column(name = "ngay_sinh")
    private Date ngaySinh;
    @Column(name = "sdt")
    private String sdt;
    @Column(name = "email")
    private String email;
    @Column(name = "mat_khau")
    private String matKhau;
    @Column(name = "hinh_anh")
    private String hinhAnh;
    @Column(name = "trang_thai")
    private Integer trangThai;
    @OneToMany(mappedBy = "khachHang")
    private List<HoaDon> hoaDons;
    @OneToMany(mappedBy = "khachHang")
    private List<ChiTietPhieuGiamGia> chiTietPhieuGiamGias;
    @OneToMany(mappedBy = "khachHang")
    private List<DiaChi> diaChis;
}