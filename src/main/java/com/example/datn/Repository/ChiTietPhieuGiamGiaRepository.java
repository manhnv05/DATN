package com.example.datn.Repository;

import com.example.datn.Entity.ChiTietPhieuGiamGia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ChiTietPhieuGiamGiaRepository extends JpaRepository<ChiTietPhieuGiamGia, Integer>, JpaSpecificationExecutor<ChiTietPhieuGiamGia> {

}