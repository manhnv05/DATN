package com.example.datn.repository;

import com.example.datn.entity.HinhThucThanhToan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface HinhThucThanhToanRepository extends JpaRepository<HinhThucThanhToan, Integer>, JpaSpecificationExecutor<HinhThucThanhToan> {

}