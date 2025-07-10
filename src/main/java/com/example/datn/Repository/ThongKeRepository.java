package com.example.datn.Repository;

import com.example.datn.Entity.HoaDon;
import com.example.datn.VO.ThongKeVoSearch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;
import java.util.List;

public interface ThongKeRepository extends JpaRepository<HoaDon, Integer> {
    @Query("SELECT hd FROM HoaDon hd WHERE DATE(hd.ngayTao) = CURRENT_DATE")
    List<HoaDon> getThongKeHomNay();

    @Query("SELECT hd FROM HoaDon hd WHERE FUNCTION('WEEK', hd.ngayTao) = FUNCTION('WEEK', CURRENT_DATE) AND FUNCTION('YEAR', hd.ngayTao) = FUNCTION('YEAR', CURRENT_DATE)")
    List<HoaDon> getThongKeTuanNay();

    @Query("SELECT hd FROM HoaDon hd WHERE MONTH(hd.ngayTao) = MONTH(CURRENT_DATE) AND YEAR(hd.ngayTao) = YEAR(CURRENT_DATE)")
    List<HoaDon> getThongKeThangNay();

    @Query("SELECT hd FROM HoaDon hd WHERE YEAR(hd.ngayTao) = YEAR(CURRENT_DATE)")
    List<HoaDon> getThongKeNamNay();

    @Query("""
    SELECT hd FROM HoaDon hd
    WHERE (:#{#search.tuNgay} IS NULL OR hd.ngayTao >= :#{#search.tuNgay})
      AND (:#{#search.denNgay} IS NULL OR hd.ngayTao <= :#{#search.denNgay})
    """)
    List<HoaDon> getAllByQuery(@RequestParam("search") ThongKeVoSearch search);
}
