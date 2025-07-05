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
@Table(name = "kich_thuoc")
public class KichThuoc implements Serializable {

    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ma")
    private String ma;

    @Column(name = "ten_kich_co")
    private String tenKichCo;

    @Column(name = "trang_thai")
    private Integer trangThai;

    @OneToMany(mappedBy = "kichThuoc")
    @ToString.Exclude
    private List<ChiTietSanPham> chiTietSanPhams;
}