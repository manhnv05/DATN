package com.example.datn.repository;

import com.example.datn.entity.KhachHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface KhachHangRepository extends JpaRepository<KhachHang, Integer>, JpaSpecificationExecutor<KhachHang> {

}