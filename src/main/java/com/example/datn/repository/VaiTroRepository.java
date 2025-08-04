package com.example.datn.repository;

import com.example.datn.entity.VaiTro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface VaiTroRepository extends JpaRepository<VaiTro, Integer>, JpaSpecificationExecutor<VaiTro> {

}