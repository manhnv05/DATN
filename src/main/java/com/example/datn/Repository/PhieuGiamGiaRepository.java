package com.example.datn.Repository;

import com.example.datn.VO.PhieuGiamVOSearch;
import com.example.datn.Entity.PhieuGiamGia;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PhieuGiamGiaRepository extends JpaRepository<PhieuGiamGia, Integer> {
    @Query("""
    SELECT s FROM PhieuGiamGia s
    WHERE
        ((:#{#search.maPhieuGiamGia} IS NULL OR s.maPhieuGiamGia LIKE %:#{#search.maPhieuGiamGia}%)
        OR (:#{#search.tenPhieu} IS NULL OR s.tenPhieu LIKE %:#{#search.tenPhieu}%))
        AND (
            (:#{#search.ngayBatDau} IS NULL OR :#{#search.ngayKetThuc} IS NULL)
             OR (
                s.ngayBatDau >= :#{#search.ngayBatDau}
                AND s.ngayKetThuc <= :#{#search.ngayKetThuc}
             )
        )
        AND (:#{#search.trangThai} IS NULL OR s.trangThai = :#{#search.trangThai})
    ORDER BY s.id DESC
    """)
    Page<PhieuGiamGia> findAllBySearch(@Param("search") PhieuGiamVOSearch search, Pageable pageable);
    List<PhieuGiamGia> findByNgayKetThucBeforeAndTrangThaiNot(LocalDateTime now , int trangThai);
    List<PhieuGiamGia> findByNgayBatDauAfterAndTrangThaiNotIn(LocalDateTime now, List<Integer> trangThais);
    @Query("""
    SELECT p FROM PhieuGiamGia p
    WHERE
    (p.ngayKetThuc > p.ngayBatDau AND p.ngayKetThuc > :now AND p.ngayBatDau < :now AND p.trangThai != 0 AND p.trangThai !=3)
    """)
    List<PhieuGiamGia> findValidPromotions(@Param("now") LocalDateTime now);

    @Query("""
    SELECT p FROM PhieuGiamGia p
    WHERE
    (p.loaiPhieu = 0 AND p.trangThai = 1)
    """)
    List<PhieuGiamGia> getPhieuGiamGiaByTrangThai();

}
