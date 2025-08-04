package com.example.datn.entity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "hoa_don_chi_tiet")
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = "hoaDon")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class HoaDonChiTiet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @ManyToOne
    @JoinColumn(name = "id_hoa_don") // FK tới bảng hoa_don
    HoaDon hoaDon;

    @ManyToOne
    @JoinColumn(name = "id_san_pham_chi_tiet") // FK tới bảng san_pham_chi_tiet
    ChiTietSanPham sanPhamChiTiet;

    @Column(name = "gia")
    Integer gia;

    @Column(name = "so_luong")
    Integer soLuong;

    @Column(name = "thanh_tien")
    Integer thanhTien;

    @Column(name = "ghi_chu")
    String ghiChu;

    @Column(name = "trang_thai")
    Boolean trangThai;
}