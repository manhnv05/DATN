package com.example.datn.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@Table(name = "lich_su_hoa_don")
public class LichSuHoaDon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(name = "ma_lich_su")
    String maLichSu;

    @Column(name = "noi_dung_thay_doi")
    String noiDungThayDoi;

    @Column(name = "nguoi_thuc_hien")
    String nguoiThucHien;

    @Column(name = "ghi_chu")
    String ghiChu;

    @Column(name = "trang_thai")
    Integer trangThai;

    @ManyToOne
    @JoinColumn(name = "id_hoa_don") // FK tới hóa đơn
    HoaDon hoaDon;
    @Column(name = "trang_thai_moi_hoa_don", length = 50)
    String trangThaiMoiHoaDon;
    @Column(name = "thoi_gian_thay_doi")
    LocalDateTime thoiGianThayDoi;
}