package com.example.datn.Repository;

import com.example.datn.Entity.ChiTietDotGiamGia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ChiTietDotGiamGiaRepository extends JpaRepository<ChiTietDotGiamGia, Integer>, JpaSpecificationExecutor<ChiTietDotGiamGia> {

}