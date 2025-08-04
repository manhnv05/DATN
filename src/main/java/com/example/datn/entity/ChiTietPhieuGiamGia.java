package com.example.datn.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "chi_tiet_phieu_giam_gia")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChiTietPhieuGiamGia {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_phieu_giam_gia", referencedColumnName = "id")
    PhieuGiamGia phieuGiamGia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_khach_hang", referencedColumnName = "id")
    KhachHang khachHang;

    @Column(name = "trang_thai")
    String trangThai;
}
