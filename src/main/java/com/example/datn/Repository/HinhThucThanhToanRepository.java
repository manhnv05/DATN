package com.example.datn.Repository;

import com.example.datn.Entity.HinhThucThanhToan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface HinhThucThanhToanRepository extends JpaRepository<HinhThucThanhToan, Integer>, JpaSpecificationExecutor<HinhThucThanhToan> {

}