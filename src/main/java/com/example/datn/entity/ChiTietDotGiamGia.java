package com.example.datn.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.sql.Date;

@Entity
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "chi_tiet_dot_giam_gia")
public class ChiTietDotGiamGia{

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Quan hệ với DotGiamGia
    @ManyToOne
    @JoinColumn(name = "id_dot_giam_gia", referencedColumnName = "id")
    private DotGiamGia dotGiamGia;

    // Quan hệ với ChiTietSanPham
    @ManyToOne
    @JoinColumn(name = "id_san_pham_chi_tiet", referencedColumnName = "id")
    private ChiTietSanPham chiTietSanPham;

    @Column(name = "gia_truoc_khi_giam")
    private Integer giaTruocKhiGiam;

    @Column(name = "gia_sau_khi_giam")
    private Integer giaSauKhiGiam;

    @Column(name = "ghi_chu")
    private String ghiChu;

    @Column(name = "ngay_tao")
    private Date ngayTao;

    @Column(name = "trang_thai")
    private Integer trangThai;
}
