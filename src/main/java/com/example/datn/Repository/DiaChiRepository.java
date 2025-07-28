package com.example.datn.Repository;

import com.example.datn.Entity.DiaChi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiaChiRepository extends JpaRepository<DiaChi, Integer>, JpaSpecificationExecutor<DiaChi> {
    List<DiaChi> getDiaChiByKhachHang_Id(Integer customerId);

    List<DiaChi> findByKhachHangId (Integer khachHangId);
}