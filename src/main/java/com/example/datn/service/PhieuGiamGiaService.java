package com.example.datn.service;

import com.example.datn.dto.PhieuGiamGiaDTO;
import com.example.datn.vo.phieuGiamGiaVO.PhieuGiamGiaVO;
import com.example.datn.vo.phieuGiamGiaVO.PhieuGiamGiaVOUpdate;
import com.example.datn.vo.phieuGiamGiaVO.PhieuGiamVOSearch;
import com.example.datn.vo.phieuGiamGiaVO.SendMailRequestData;
import org.springframework.data.domain.Page;

public interface PhieuGiamGiaService {
    Page<PhieuGiamGiaDTO> getAllPhieuGiamGia(int page, int size, PhieuGiamVOSearch search);
    PhieuGiamGiaDTO getPhieuGiamGiaById(int id);
    PhieuGiamGiaDTO createPhieuGiamGia(PhieuGiamGiaVO phieuGiamGiaRequest);
    PhieuGiamGiaDTO updatePhieuGiamGia(PhieuGiamGiaVOUpdate phieuGiamGiaRequestUpdate);
    boolean deletePhieuGiamGia(int id);
    PhieuGiamGiaDTO updateStatusPhieuGiamGia(int id, int status);
    void sendMailToListCustomer(SendMailRequestData sendMailRequestData);
    String tangSoluongPhieuGiamGia(Integer idPhieuGiamGia, Integer soLuong);
    String giamSoluongPhieuGiamGia(Integer idPhieuGiamGia, Integer soLuong, Integer idKhachHang);
}