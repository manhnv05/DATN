package com.example.datn.Repository;

import com.example.datn.Entity.NhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface NhanVienRepository extends JpaRepository<NhanVien, Integer>, JpaSpecificationExecutor<NhanVien> {

    Boolean existsByEmail(String email);
    Boolean existsBySoDienThoai(String soDienThoai);
    Boolean existsByCanCuocCongDan(String canCuocCongDan);

    boolean existsByEmailAndIdNot(String email, Integer id);
    boolean existsBySoDienThoaiAndIdNot(String soDienThoai, Integer id);
    boolean existsByCanCuocCongDanAndIdNot(String canCuocCongDan, Integer id);
}