package com.example.datn.Repository;

import com.example.datn.Entity.KhachHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;


@Repository
public interface KhachHangRepository extends JpaRepository<KhachHang, Integer>, JpaSpecificationExecutor<KhachHang> {

    Boolean existsByEmailAndIdNot(String email, Integer id);
    Boolean existsBySdtAndIdNot(String soDienThoai, Integer id);

    Boolean existsByEmail(String email);

    Boolean existsBySdt(String soDienThoai);

}