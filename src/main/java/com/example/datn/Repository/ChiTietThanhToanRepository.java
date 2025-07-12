package com.example.datn.Repository;

import com.example.datn.Entity.ChiTietThanhToan;
import com.example.datn.VO.ChiTietThanhToanResponseVO;
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
}