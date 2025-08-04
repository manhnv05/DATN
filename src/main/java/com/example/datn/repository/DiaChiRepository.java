package com.example.datn.repository;

import com.example.datn.entity.DiaChi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface DiaChiRepository extends JpaRepository<DiaChi, Integer>, JpaSpecificationExecutor<DiaChi> {
    List<DiaChi> getDiaChiByKhachHang_Id(Integer customerId);

    List<DiaChi> findByKhachHangId (Integer khachHangId);
}