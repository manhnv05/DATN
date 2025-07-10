package com.example.datn.Repository;

import com.example.datn.Entity.HoaDon;
import com.example.datn.Entity.HoaDonChiTiet;
import com.example.datn.VO.ThongKeVoSearch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface ThongKeSanPhamRepository extends JpaRepository<HoaDonChiTiet, Integer> {
    @Query("""
    SELECT hdct FROM HoaDonChiTiet hdct
    WHERE FUNCTION('DATE', hdct.hoaDon.ngayTao) = CURRENT_DATE
    AND hdct.hoaDon.trangThai = 4
    """)
    Page<HoaDonChiTiet> getThongKeHomNay(Pageable pageable);

    @Query("""
    SELECT hdct FROM HoaDonChiTiet hdct
    WHERE FUNCTION('WEEK', hdct.hoaDon.ngayTao) = FUNCTION('WEEK', CURRENT_DATE)
    AND FUNCTION('YEAR', hdct.hoaDon.ngayTao) = FUNCTION('YEAR', CURRENT_DATE)
    AND hdct.hoaDon.trangThai = 4
    """)
    Page<HoaDonChiTiet> getThongKeTuanNay(Pageable pageable);

    @Query("""
    SELECT hdct FROM HoaDonChiTiet hdct
    WHERE MONTH(hdct.hoaDon.ngayTao) = MONTH(CURRENT_DATE)
    AND YEAR(hdct.hoaDon.ngayTao) = YEAR(CURRENT_DATE)
    AND hdct.hoaDon.trangThai = 4
    """)
    Page<HoaDonChiTiet> getThongKeThangNay(Pageable pageable);

    @Query("""
    SELECT hdct FROM HoaDonChiTiet hdct
    WHERE YEAR(hdct.hoaDon.ngayTao) = YEAR(CURRENT_DATE)
    AND hdct.hoaDon.trangThai = 4
    """)
    Page<HoaDonChiTiet> getThongKeNamNay(Pageable pageable);

    @Query("""
    SELECT hdct FROM HoaDonChiTiet hdct
    WHERE (:#{#search.tuNgay} IS NULL OR hdct.hoaDon.ngayTao >= :#{#search.tuNgay})
      AND (:#{#search.denNgay} IS NULL OR hdct.hoaDon.ngayTao <= :#{#search.denNgay})
      AND hdct.hoaDon.trangThai = 4
    """)
    Page<HoaDonChiTiet> getAllByQuery(@RequestParam("search") ThongKeVoSearch search, Pageable pageable);
}
