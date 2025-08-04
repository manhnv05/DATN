package com.example.datn.repository;

import com.example.datn.dto.LichSuThanhToanDTO;
import com.example.datn.dto.LichSuThanhToanProjection;
import com.example.datn.entity.ChiTietThanhToan;
import com.example.datn.vo.chiTietThanhToanVO.ChiTietThanhToanResponseVO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChiTietThanhToanRepository extends JpaRepository<ChiTietThanhToan, Integer>, JpaSpecificationExecutor<ChiTietThanhToan> {
    @Query(value = "select cttt.ma_giao_dich,cttt.ngay_thanh_toan, httt.phuong_thuc_thanh_toan, cttt.so_tien_thanh_toan   from chi_tiet_thanh_toan cttt\n" +
            "join hinh_thuc_thanh_toan httt on cttt.id_hinh_thuc_thanh_toan= httt.id\n" +
            "where id_hoa_don = :idHoaDon",nativeQuery = true)
    List<ChiTietThanhToanResponseVO> findChiTietThanhToanByHoaDonId(Integer idHoaDon);
    boolean existsByHoaDonId(Integer idHoaDon);

    @Query("SELECT COALESCE(SUM(ctt.soTienThanhToan), 0) FROM ChiTietThanhToan ctt WHERE ctt.hoaDon.id = :idHoaDon")
    Integer sumSoTienThanhToanByIdHoaDon(@Param("idHoaDon") Integer idHoaDon);

    @Query(
            value = "SELECT " +
                    "    ctt.so_tien_thanh_toan AS soTienThanhToan, " +
                    "    ctt.ma_giao_dich AS maGiaoDich, " +
                    "    ctt.ngay_thanh_toan AS thoiGianThanhToan, " +
                    "    ctt.ghi_chu AS ghiChu, " +
                    "    nv.ho_va_ten AS nhanVienXacNhan, " +
                    "    httt.phuong_thuc_thanh_toan AS tenHinhThucThanhToan " + // THÊM DÒNG NÀY
                    "FROM chi_tiet_thanh_toan ctt " +
                    "JOIN hoa_don hd ON hd.id = ctt.id_hoa_don " +
                    "JOIN nhan_vien nv ON nv.id = hd.id_nhan_vien " +
                    "JOIN hinh_thuc_thanh_toan httt ON httt.id = ctt.id_hinh_thuc_thanh_toan " + // THÊM DÒNG NÀY
                    "WHERE ctt.id_hoa_don = :idHoaDon",
            nativeQuery = true
    )
    List<LichSuThanhToanProjection> findLichSuThanhToanByIdHoaDon(@Param("idHoaDon") Integer idHoaDon);
}