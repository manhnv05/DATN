package com.example.datn.Repository;

import com.example.datn.Entity.ChiTietThanhToan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ChiTietThanhToanRepository extends JpaRepository<ChiTietThanhToan, Integer>, JpaSpecificationExecutor<ChiTietThanhToan> {

}