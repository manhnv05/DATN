package com.example.datn.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "chi_tiet_thanh_toan")
public class ChiTietThanhToan{


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_hoa_don", referencedColumnName = "id")
    private HoaDon hoaDon;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_hinh_thuc_thanh_toan", referencedColumnName = "id")
    private HinhThucThanhToan hinhThucThanhToan;


    @Column(name = "ma_giao_dich")
    private String maGiaoDich;

    @Column(name = "so_tien_thanh_toan")
    private Integer soTienThanhToan;

    @Column(name = "ngay_thanh_toan")
    private LocalDateTime ngayThanhToan;

    @Column(name = "trang_thai_thanh_toan")
    private Integer trangThaiThanhToan;

    @Column(name = "ghi_chu")
    private String ghiChu;
}
