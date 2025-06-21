package com.example.datn.Entity;

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
@Table(name = "mau_sac")
public class MauSac implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ten_mau_sac")
    private String tenMauSac;

    @Column(name = "ma_mau")
    private String maMau;

    @Column(name = "trang_thai")
    private Integer trangThai;

    @OneToMany(mappedBy = "mauSac")
    @ToString.Exclude
    private List<ChiTietSanPham> chiTietSanPhams;
}