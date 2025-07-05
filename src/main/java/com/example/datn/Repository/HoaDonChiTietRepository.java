package com.example.datn.Repository;

import com.example.datn.DTO.HoaDonChiTietView;
import com.example.datn.Entity.HoaDon;
import com.example.datn.Entity.HoaDonChiTiet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface HoaDonChiTietRepository extends JpaRepository<HoaDonChiTiet, Integer> {
    List<HoaDonChiTiet> findByHoaDon(HoaDon hoaDon);

    List<HoaDonChiTiet> findAllByHoaDon_Id(Integer hoaDonId);

    @Query(value = "SELECT\n" +
            "    hdct.id AS id,\n" +
            "    hdct.so_luong AS soLuong,\n" +
            "    hdct.gia AS gia,\n" +
            "    hdct.thanh_tien AS thanhTien,\n" +
            "    hdct.ghi_chu AS ghiChu,\n" +
            "    hdct.trang_thai AS trangThai,\n" +
            "    ctsp.ma_san_pham_chi_tiet AS maSanPhamChiTiet,\n" +
            "    sp.ten_san_pham AS tenSanPham,\n" +
            "    ms.ten_mau_sac AS tenMauSac,\n" +
            "    kt.ten_kich_co  AS tenKichThuoc,\n" +
            "    ctsp.id as idChiTietSanPham,\n" +
            "    ha.duong_dan_anh AS duongDanAnh \n" +
            "FROM\n" +
            "    hoa_don_chi_tiet AS hdct\n" +
            "JOIN\n" +
            "    chi_tiet_san_pham AS ctsp ON hdct.id_san_pham_chi_tiet = ctsp.id\n" +
            "JOIN\n" +
            "    san_pham AS sp ON ctsp.id_san_pham = sp.id\n" +
            "JOIN\n" +
            "    mau_sac AS ms ON ctsp.id_mau_sac = ms.id\n" +
            "JOIN\n" +
            "    kich_thuoc AS kt ON ctsp.id_kich_thuoc = kt.id\n" +
            "LEFT JOIN hinh_anh  AS ha ON ctsp.id = ha.id_san_pham_chi_tiet\n" +
            "WHERE\n" +
            "    hdct.id_hoa_don = :idHoaDon", nativeQuery = true)
    List<HoaDonChiTietView> findChiTietHoaDon(@Param("idHoaDon") Integer idHoaDon);

}
