package com.example.datn.Repository;

import com.example.datn.Entity.ChiTietSanPham;
import com.example.datn.VO.ChiTietSanPhamBanHangTaiQuayVO;
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

    @Query(value = """
  SELECT
      ctsp.id,
      ha.duong_dan_anh,
      sp.ten_san_pham,
      sp.ma_san_pham,
      th.ten AS ten_thuong_hieu,
      dm.ten AS ten_danh_muc,
      cl.ten AS ten_chat_lieu,
      ms.ten AS ten_mau_sac,
      kt.ten_kich_thuoc,
      co.ten AS ten_co_ao,
      ta.ten AS ten_tay_ao,
      ctsp.gia
  FROM
      datn_demo.chi_tiet_san_pham ctsp
  LEFT JOIN datn_demo.san_pham sp ON ctsp.id_san_pham = sp.id
  LEFT JOIN datn_demo.mau_sac ms ON ms.id = ctsp.id_mau_sac
  LEFT JOIN datn_demo.danh_muc dm ON sp.id_danh_muc = dm.id
  LEFT JOIN datn_demo.chat_lieu cl ON sp.id_chat_lieu = cl.id
  LEFT JOIN datn_demo.kich_thuoc kt ON kt.id = ctsp.id_kich_thuoc
  LEFT JOIN datn_demo.co_ao co ON co.id = ctsp.id_co_ao
  LEFT JOIN datn_demo.tay_ao ta ON ta.id = ctsp.id_tay_ao
  LEFT JOIN datn_demo.thuong_hieu th ON sp.id_thuong_hieu = th.id
  LEFT JOIN datn_demo.hinh_anh ha ON ha.id_san_pham_chi_tiet = ctsp.id
            WHERE
    ctsp.so_luong > 0

""",nativeQuery = true)
    List<ChiTietSanPhamBanHangTaiQuayVO> findChiTietSanPhamBanHangTaiQuay();
}