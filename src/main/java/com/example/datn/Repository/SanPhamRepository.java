package com.example.datn.Repository;

import com.example.datn.Entity.SanPham;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SanPhamRepository extends JpaRepository<SanPham, Integer>, JpaSpecificationExecutor<SanPham> {

    List<SanPham> findByMaSanPhamOrTenSanPham(String maSanPham, String tenSanPham);

    @Query("SELECT s.tenSanPham FROM SanPham s WHERE s.trangThai IN (0, 1)")
    List<String> findAllTenSanPham();

    @Modifying
    @Transactional
    @Query("UPDATE SanPham s SET s.trangThai = 3 WHERE s.id = :id")
    void softDeleteById(Integer id);

    @Query("SELECT s FROM SanPham s WHERE s.trangThai IN (0, 1) ORDER BY s.id DESC")
    List<SanPham> findActiveSanPhamOrderByIdDesc();

    @Query("SELECT s FROM SanPham s WHERE s.trangThai IN (0, 1)")
    Page<SanPham> findAllActive(Pageable pageable);

    @Query("SELECT s FROM SanPham s WHERE s.trangThai IN (0, 1) AND LOWER(s.tenSanPham) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<SanPham> searchByTenSanPhamActive(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT s.maSanPham FROM SanPham s")
    List<String> findAllMaSanPham();
}