package com.example.datn.repository;

import com.example.datn.entity.ChiTietDotGiamGia;
import com.example.datn.entity.DotGiamGia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChiTietDotGiamGiaRepository extends JpaRepository<ChiTietDotGiamGia, Integer>, JpaSpecificationExecutor<ChiTietDotGiamGia> {

    // Lấy danh sách chi tiết theo id đợt giảm giá
    List<ChiTietDotGiamGia> findByDotGiamGiaId(Integer idDotGiamGia);

    // Tìm 1 bản ghi chi tiết theo id đợt giảm giá và id sản phẩm chi tiết
    Optional<ChiTietDotGiamGia> findByDotGiamGiaIdAndChiTietSanPhamId(Integer idDotGiamGia, Integer idSanPhamChiTiet);

    // Xóa toàn bộ chi tiết thuộc về đợt giảm giá
    void deleteByDotGiamGiaId(Integer idDotGiamGia);

    @Query("""
    SELECT p.dotGiamGia FROM ChiTietDotGiamGia p
    WHERE
        p.chiTietSanPham.id = :idctsp
        AND p.dotGiamGia.trangThai = 1
""")
    List<DotGiamGia> getDotGiamGiaByIdChiTietSanPham(@Param("idctsp") int idChiTietSanPham);

}