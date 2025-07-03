package com.example.datn.Repository;

import com.example.datn.Entity.ChiTietSanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChiTietSanPhamRepository extends JpaRepository<ChiTietSanPham, Integer>, JpaSpecificationExecutor<ChiTietSanPham> {

    List<ChiTietSanPham> findByMaSanPhamChiTietContainingIgnoreCaseOrMoTaContainingIgnoreCase(String maSanPhamChiTiet, String moTa);

    List<ChiTietSanPham> findBySanPhamId(Integer idSanPham);

    ChiTietSanPham findByMaSanPhamChiTiet(String maSanPhamChiTiet);

    @Query("SELECT c.maSanPhamChiTiet FROM ChiTietSanPham c")
    List<String> findAllMaChiTietSanPham();
}