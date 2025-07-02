package com.example.datn.Repository;

import com.example.datn.Entity.DiaChi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface DiaChiRepository extends JpaRepository<DiaChi, Integer>, JpaSpecificationExecutor<DiaChi> {

}