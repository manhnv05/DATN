package com.example.datn.Repository;

import com.example.datn.Entity.XuatXu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface XuatXuRepository extends JpaRepository<XuatXu, Integer>, JpaSpecificationExecutor<XuatXu> {

}