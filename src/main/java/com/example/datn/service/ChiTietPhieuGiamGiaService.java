package com.example.datn.service;


import com.example.datn.dto.ChiTietPhieuGiamGiaDTO;
import com.example.datn.dto.PhieuGiamGiaDTO;
import com.example.datn.vo.chiTietPhieuGiamGiaVO.ChiTietPhieuGiamGiaUpdateVO;
import com.example.datn.vo.chiTietPhieuGiamGiaVO.ChiTietPhieuGiamGiaVO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ChiTietPhieuGiamGiaService {
    List<ChiTietPhieuGiamGiaDTO> getAllPhieuGiamGiaKhachHang();
    ChiTietPhieuGiamGiaDTO getPhieuGiamGiaKhachHangById(int id);
    List<ChiTietPhieuGiamGiaDTO> createPhieuGiamGiaKhachHang(List<ChiTietPhieuGiamGiaVO> listphieuGiamGiaKhachHangRequest);
    List<ChiTietPhieuGiamGiaDTO> updatePhieuGiamGiaKhachHang(List<ChiTietPhieuGiamGiaUpdateVO> phieuGiamGiaKhachHangUpdate);
    boolean deletePhieuGiamGiaKhachHang(int id);
    Page<PhieuGiamGiaDTO> queryPhieuGiamGiaKhachHang(int page, int size, ChiTietPhieuGiamGiaVO request);
    Page<ChiTietPhieuGiamGiaDTO> getpggkh(int page, int size, ChiTietPhieuGiamGiaVO request);
    ChiTietPhieuGiamGiaDTO findVoucherByCodeForCustomer(String maPhieu, Integer idKhachHang);
}