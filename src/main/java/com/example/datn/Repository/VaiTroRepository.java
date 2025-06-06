package com.example.datn.Repository;

import com.example.datn.Entity.VaiTro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface VaiTroRepository extends JpaRepository<VaiTro, Integer>, JpaSpecificationExecutor<VaiTro> {

}