package com.example.datn.service.impl;

import com.example.datn.dto.ChiTietPhieuGiamGiaDTO;
import com.example.datn.entity.ChiTietPhieuGiamGia;
import com.example.datn.repository.ChiTietPhieuGiamGiaRepository;
import com.example.datn.service.ChiTietPhieuGiamGiaService;
import com.example.datn.vo.chiTietPhieuGiamGiaVO.ChiTietPhieuGiamGiaUpdateVO;
import com.example.datn.vo.chiTietPhieuGiamGiaVO.ChiTietPhieuGiamGiaVO;
import com.example.datn.exception.AppException;
import com.example.datn.exception.ErrorCode;
import com.example.datn.mapper.ChiTietPhieuGiamGiaMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PhieuGiamGiaKhachHangServiceimpl implements ChiTietPhieuGiamGiaService {

    @Autowired
    private ChiTietPhieuGiamGiaRepository phieuGiamGiaKhachHangRepository;

    @Override
    public List<ChiTietPhieuGiamGiaDTO> getAllPhieuGiamGiaKhachHang() {
        List<ChiTietPhieuGiamGia> phieuGiamGiaKhachHangList = phieuGiamGiaKhachHangRepository.findAll();
        return phieuGiamGiaKhachHangList
                .stream()
                .map(ChiTietPhieuGiamGiaMapper.INSTANCE::toResponse).toList();
    }

    @Override
    public ChiTietPhieuGiamGiaDTO getPhieuGiamGiaKhachHangById(int id) {
        ChiTietPhieuGiamGia phieuGiamGiaKhachHang = phieuGiamGiaKhachHangRepository
                .findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PHIEU_GIAM_GIA_KHACH_HANG_NOT_FOUND));
        return ChiTietPhieuGiamGiaMapper.INSTANCE.toResponse(phieuGiamGiaKhachHang);
    }

    @Override
    public List<ChiTietPhieuGiamGiaDTO> createPhieuGiamGiaKhachHang(List<ChiTietPhieuGiamGiaVO> listRequest) {
        List<ChiTietPhieuGiamGia> listEntity = listRequest.stream().map(ChiTietPhieuGiamGiaMapper.INSTANCE::toPhieuGiamGiaKhachHang).toList();
        return phieuGiamGiaKhachHangRepository
                .saveAll(listEntity)
                .stream()
                .map(ChiTietPhieuGiamGiaMapper.INSTANCE::toResponse).toList();
    }

    @Override
    public List<ChiTietPhieuGiamGiaDTO> updatePhieuGiamGiaKhachHang(List<ChiTietPhieuGiamGiaUpdateVO> phieuGiamGiaKhachHangUpdate) {
        List<ChiTietPhieuGiamGia> phieuGiamGiaKhachHangList = new ArrayList<>();
        for(ChiTietPhieuGiamGiaUpdateVO updateDTO : phieuGiamGiaKhachHangUpdate){
            if(updateDTO.getId() != null){
                ChiTietPhieuGiamGia phieuGiamGiaKhachHang = phieuGiamGiaKhachHangRepository.findById(updateDTO.getId())
                        .orElseThrow(()-> new AppException(ErrorCode.PHIEU_GIAM_GIA_KHACH_HANG_NOT_FOUND));
                ChiTietPhieuGiamGiaMapper.INSTANCE.updatePhieuGiamGiaKhachHang(phieuGiamGiaKhachHang, updateDTO);
                phieuGiamGiaKhachHangList.add(phieuGiamGiaKhachHang);
            }
        }
        phieuGiamGiaKhachHangRepository.saveAll(phieuGiamGiaKhachHangList);
        return phieuGiamGiaKhachHangList.stream().map(ChiTietPhieuGiamGiaMapper.INSTANCE::toResponse).toList();
    }

    @Override
    public boolean deletePhieuGiamGiaKhachHang(int id) {
        ChiTietPhieuGiamGia phieuGiamGiaKhachHang = phieuGiamGiaKhachHangRepository.findById(id).orElse(null);
        if(phieuGiamGiaKhachHang==null){
            return false;
        }
        else {
            phieuGiamGiaKhachHangRepository.deleteById(id);
            return true;
        }
    }

    @Override
    public Page<ChiTietPhieuGiamGiaDTO> queryPhieuGiamGiaKhachHang(int page, int size, ChiTietPhieuGiamGiaVO request) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ChiTietPhieuGiamGia> phieuGiamGiaKhachHangs = phieuGiamGiaKhachHangRepository
                .queryPhieuGiamGiaKhachHang(request.getKhachHang(), request.getPhieuGiamGia(), pageable);
        return phieuGiamGiaKhachHangs.map(ChiTietPhieuGiamGiaMapper.INSTANCE::toResponse);
    }
}
