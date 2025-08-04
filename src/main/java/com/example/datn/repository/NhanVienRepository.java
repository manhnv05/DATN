package com.example.datn.repository;

import com.example.datn.entity.NhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;


// Đã chuẩn để sử dụng với Specification cho filter động
@Repository
public interface NhanVienRepository extends JpaRepository<NhanVien, Integer>, JpaSpecificationExecutor<NhanVien> {

}