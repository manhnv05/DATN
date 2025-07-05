package com.example.datn.repository;

import com.example.datn.entity.ChiTietThanhToan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ChiTietThanhToanRepository extends JpaRepository<ChiTietThanhToan, Integer>, JpaSpecificationExecutor<ChiTietThanhToan> {

}