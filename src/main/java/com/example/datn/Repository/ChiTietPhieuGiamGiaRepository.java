package com.example.datn.Repository;

import com.example.datn.Entity.ChiTietPhieuGiamGia;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

public interface ChiTietPhieuGiamGiaRepository extends JpaRepository<ChiTietPhieuGiamGia, Integer>, JpaSpecificationExecutor<ChiTietPhieuGiamGia> {
    @Query("""
    SELECT pddkh FROM ChiTietPhieuGiamGia pddkh
    WHERE
        (:khachHang IS NULL OR :khachHang = pddkh.khachHang.id)
        AND (:phieuGiamGia IS NULL OR :phieuGiamGia = pddkh.phieuGiamGia.id)
    """)
    Page<ChiTietPhieuGiamGia> queryPhieuGiamGiaKhachHang(
            @Param("khachHang") String khachHang,
            @Param("phieuGiamGia") String phieuGiamGia,
            Pageable pageable
    );
}