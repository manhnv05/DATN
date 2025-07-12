package com.example.datn.Service.impl;

import com.example.datn.DTO.ChiTietPhieuGiamGiaDTO;
import com.example.datn.Entity.ChiTietPhieuGiamGia;
import com.example.datn.Repository.ChiTietPhieuGiamGiaRepository;
import com.example.datn.Service.ChiTietPhieuGiamGiaService;
import com.example.datn.VO.ChiTietPhieuGiamGiaUpdateVO;
import com.example.datn.VO.ChiTietPhieuGiamGiaVO;
import com.example.datn.exception.AppException;
import com.example.datn.exception.ErrorCode;
import com.example.datn.mapper.ChiTietPhieuGiamGiaMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

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

        if(request.getTongTienHoaDon()!=null) {
            List<ChiTietPhieuGiamGia> chiTietPhieuGiamGiaList = phieuGiamGiaKhachHangs.getContent();
            return getChiTietPhieuGiam(chiTietPhieuGiamGiaList, request);
        }
        else {
            return phieuGiamGiaKhachHangs.map(ChiTietPhieuGiamGiaMapper.INSTANCE::toResponse);
        }
    }
    public Page<ChiTietPhieuGiamGiaDTO> getChiTietPhieuGiam(List<ChiTietPhieuGiamGia> data, ChiTietPhieuGiamGiaVO request) {
        List<ChiTietPhieuGiamGia> sortCTPGG = new ArrayList<>();
        for(ChiTietPhieuGiamGia dataE : data){
            if (request.getTongTienHoaDon().compareTo(new BigDecimal(dataE.getPhieuGiamGia().getDieuKienGiam())) >= 0) {
                if(dataE.getPhieuGiamGia().getPhamTramGiamGia() != null){
                    BigDecimal soTienGiam = dataE.getPhieuGiamGia().getPhamTramGiamGia()
                            .multiply(request.getTongTienHoaDon())
                            .divide(BigDecimal.valueOf(100));

                    dataE.getPhieuGiamGia().setSoTienGiam(soTienGiam);
                    sortCTPGG.add(dataE);
                }
                else {
                    sortCTPGG.add(dataE);
                }
            }
        }
        sortCTPGG.sort(Comparator.comparing(
                ct -> ct.getPhieuGiamGia().getSoTienGiam(), Comparator.reverseOrder()
        ));
        List<ChiTietPhieuGiamGia> oldList = new LinkedList<>();

        for(ChiTietPhieuGiamGia sortDTO : sortCTPGG){
            if(sortDTO.getPhieuGiamGia().getPhamTramGiamGia() != null){
                sortDTO.getPhieuGiamGia().setSoTienGiam(new BigDecimal(0));
                oldList.add(sortDTO);
            }
            else {
                oldList.add(sortDTO);
            }
        }
        List<ChiTietPhieuGiamGiaDTO> dtoList = oldList.stream()
                .map(ChiTietPhieuGiamGiaMapper.INSTANCE::toResponse)
                .collect(Collectors.toList());
        return new PageImpl<>(dtoList, PageRequest.of(1, dtoList.size()), dtoList.size());
    }
}
