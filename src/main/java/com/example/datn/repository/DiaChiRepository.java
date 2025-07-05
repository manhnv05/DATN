package com.example.datn.repository;

import com.example.datn.entity.DiaChi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface DiaChiRepository extends JpaRepository<DiaChi, Integer>, JpaSpecificationExecutor<DiaChi> {

}