package com.example.datn.Repository;

import com.example.datn.Entity.HoaDonChiTiet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface HoaDonChiTietRepository extends JpaRepository<HoaDonChiTiet, Integer>, JpaSpecificationExecutor<HoaDonChiTiet> {

}