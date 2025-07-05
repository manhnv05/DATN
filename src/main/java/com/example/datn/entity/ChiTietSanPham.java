package com.example.datn.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "chi_tiet_san_pham")
public class ChiTietSanPham implements java.io.Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_san_pham", nullable = false)
    private SanPham sanPham;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_chat_lieu")
    private ChatLieu chatLieu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_thuong_hieu")
    private ThuongHieu thuongHieu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_mau_sac", nullable = false)
    private MauSac mauSac;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_kich_thuoc", nullable = false)
    private KichThuoc kichThuoc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_co_ao", nullable = false)
    private CoAo coAo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tay_ao", nullable = false)
    private TayAo tayAo;

    @Column(name = "ma_san_pham_chi_tiet", length = 50)
    private String maSanPhamChiTiet;

    @Column(name = "gia")
    private Integer gia;

    @Column(name = "so_luong")
    private Integer soLuong;

    @Column(name = "trong_luong")
    private Integer trongLuong;

    @Column(name = "mo_ta", length = 50)
    private String moTa;

    @Column(name = "trang_thai")
    private Integer trangThai;
}