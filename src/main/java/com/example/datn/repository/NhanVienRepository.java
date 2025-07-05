package com.example.datn.repository;

import com.example.datn.entity.NhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface NhanVienRepository extends JpaRepository<NhanVien, Integer>, JpaSpecificationExecutor<NhanVien> {

}