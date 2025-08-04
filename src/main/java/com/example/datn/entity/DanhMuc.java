package com.example.datn.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;
import java.util.List;

@Entity
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "danh_muc")
public class DanhMuc implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "ma_danh_muc")
    private String maDanhMuc;

    @Column(name = "ten_danh_muc")
    private String tenDanhMuc;

    @Column(name = "trang_thai")
    private Integer trangThai;

    // Quan hệ 1-n với SanPham
    @OneToMany(mappedBy = "danhMuc")
    @ToString.Exclude
    private List<SanPham> sanPhams;
}