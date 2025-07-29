package com.example.datn.repository;

import com.example.datn.entity.HinhAnh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HinhAnhRepository extends JpaRepository<HinhAnh, Integer>, JpaSpecificationExecutor<HinhAnh> {

    List<HinhAnh> findByChiTietSanPham_Id(Integer idSanPhamChiTiet);

    //HinhAnh findById(Integer id);
}