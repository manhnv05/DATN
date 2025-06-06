package com.example.datn.Repository;

import com.example.datn.Entity.DotGiamGia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface DotGiamGiaRepository extends JpaRepository<DotGiamGia, Integer>, JpaSpecificationExecutor<DotGiamGia> {

}