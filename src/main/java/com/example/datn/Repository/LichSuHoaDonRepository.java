package com.example.datn.Repository;

import com.example.datn.Entity.LichSuHoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface LichSuHoaDonRepository extends JpaRepository<LichSuHoaDon, Integer>, JpaSpecificationExecutor<LichSuHoaDon> {

}