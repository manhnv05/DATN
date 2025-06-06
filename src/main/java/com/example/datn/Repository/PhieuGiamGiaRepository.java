package com.example.datn.Repository;

import com.example.datn.Entity.PhieuGiamGia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface PhieuGiamGiaRepository extends JpaRepository<PhieuGiamGia, Integer>, JpaSpecificationExecutor<PhieuGiamGia> {

}