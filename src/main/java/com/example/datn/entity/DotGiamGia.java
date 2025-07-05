package com.example.datn.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.sql.Date;
import java.util.List;

@Entity
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "dot_giam_gia")
public class DotGiamGia{


    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ma_dot_giam_gia")
    private String maDotGiamGia;

    @Column(name = "ten_dot_giam_gia")
    private String tenDotGiamGia;

    @Column(name = "phan_tram_giam_gia")
    private Integer phanTramGiamGia;

    @Column(name = "ngay_bat_dau")
    private Date ngayBatDau;

    @Column(name = "ngay_ket_thuc")
    private Date ngayKetThuc;

    @Column(name = "ngay_tao")
    private Date ngayTao;

    @Column(name = "ngay_sua")
    private Date ngaySua;

    @Column(name = "mo_ta")
    private String moTa;

    @Column(name = "trang_thai")
    private Integer trangThai;

    @OneToMany(mappedBy = "dotGiamGia")
    private List<ChiTietDotGiamGia> chiTietDotGiamGias;
}