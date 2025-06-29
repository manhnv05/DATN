package com.example.datn.Service;


import com.example.datn.DTO.ChiTietPhieuGiamGiaDTO;
import com.example.datn.VO.ChiTietPhieuGiamGiaUpdateVO;
import com.example.datn.VO.ChiTietPhieuGiamGiaVO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ChiTietPhieuGiamGiaService {
    List<ChiTietPhieuGiamGiaDTO> getAllPhieuGiamGiaKhachHang();
    ChiTietPhieuGiamGiaDTO getPhieuGiamGiaKhachHangById(int id);
    List<ChiTietPhieuGiamGiaDTO> createPhieuGiamGiaKhachHang(List<ChiTietPhieuGiamGiaVO> listphieuGiamGiaKhachHangRequest);
    List<ChiTietPhieuGiamGiaDTO> updatePhieuGiamGiaKhachHang(List<ChiTietPhieuGiamGiaUpdateVO> phieuGiamGiaKhachHangUpdate);
    boolean deletePhieuGiamGiaKhachHang(int id);
    Page<ChiTietPhieuGiamGiaDTO> queryPhieuGiamGiaKhachHang(int page, int size, ChiTietPhieuGiamGiaVO request);
}
