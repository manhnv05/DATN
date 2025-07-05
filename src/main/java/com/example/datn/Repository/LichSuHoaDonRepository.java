package com.example.datn.Repository;

import com.example.datn.DTO.HoaDonHistoryDTO;
import com.example.datn.Entity.LichSuHoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface LichSuHoaDonRepository extends JpaRepository<LichSuHoaDon, Integer> {
    //    List<LichSuHoaDon> findByHoaDon_OrderByThoiGianThayDoiDesc(Integer hoaDonId);
    // Trong LichSuHoaDonRepository.java
    @Query(value = """
SELECT
    ls.thoi_gian_thay_doi AS thoiGian,
    ls.nguoi_thuc_hien AS nguoiChinhSua,
    ls.trang_thai_moi_hoa_don AS trangThaiHoaDon,
    ls.ghi_chu AS ghiChu
FROM
    datn_demo.lich_su_hoa_don ls
JOIN
    datn_demo.hoa_don hd ON hd.id = ls.id_hoa_don
WHERE
    hd.id = :idHoaDon
ORDER BY
    ls.thoi_gian_thay_doi DESC
LIMIT 1 OFFSET 1
    """, nativeQuery = true)
    HoaDonHistoryDTO findTrangThaiGanNhatCuaHoaDon( Integer idHoaDon);


    List<LichSuHoaDon> findByHoaDon_MaHoaDonOrderByThoiGianThayDoiDesc(String maHoaDon);
}

