package com.example.datn.Service.impl;

import com.example.datn.DTO.ChiTietPhieuGiamGiaDTO;
import com.example.datn.DTO.PhieuGiamGiaDTO;
import com.example.datn.Entity.ChiTietPhieuGiamGia;
import com.example.datn.Entity.PhieuGiamGia;
import com.example.datn.Repository.ChiTietPhieuGiamGiaRepository;
import com.example.datn.Repository.PhieuGiamGiaRepository;
import com.example.datn.Service.ChiTietPhieuGiamGiaService;
import com.example.datn.VO.ChiTietPhieuGiamGiaUpdateVO;
import com.example.datn.VO.ChiTietPhieuGiamGiaVO;
import com.example.datn.exception.AppException;
import com.example.datn.exception.ErrorCode;
import com.example.datn.mapper.ChiTietPhieuGiamGiaMapper;
import com.example.datn.mapper.PhieuGiamGiaMapper;
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
    @Autowired
    private PhieuGiamGiaRepository phieuGiamGiaRepository;

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
    public Page<PhieuGiamGiaDTO> queryPhieuGiamGiaKhachHang(int page, int size, ChiTietPhieuGiamGiaVO request) {

        Pageable pageable = PageRequest.of(page, size);

        Page<PhieuGiamGia> phieuGiamGias = phieuGiamGiaKhachHangRepository
                .queryPhieuGiamGiaKhachHang(request.getKhachHang(), request.getPhieuGiamGia(), pageable);

        if(request.getTongTienHoaDon()!=null) {
            List<PhieuGiamGia> combinedList = new ArrayList<>();
            if (request.getKhachHang() != null) {
                combinedList.addAll(phieuGiamGias.getContent());
            }
            combinedList.addAll(phieuGiamGiaRepository.getPhieuGiamGiaByTrangThai());
            return getChiTietPhieuGiam(combinedList, request);
        }
        else {
            return phieuGiamGias.map(PhieuGiamGiaMapper.INSTANCE::toResponse);
        }
    }

    @Override
    public Page<ChiTietPhieuGiamGiaDTO> getpggkh(int page, int size, ChiTietPhieuGiamGiaVO request) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ChiTietPhieuGiamGia> chiTietPhieuGiamGias = phieuGiamGiaKhachHangRepository
                .getChiTietPhieuGiamGias(request.getKhachHang(), request.getPhieuGiamGia(), pageable);
        return chiTietPhieuGiamGias.map(ChiTietPhieuGiamGiaMapper.INSTANCE::toResponse);
    }

    public Page<PhieuGiamGiaDTO> getChiTietPhieuGiam(List<PhieuGiamGia> data, ChiTietPhieuGiamGiaVO request) {
        List<PhieuGiamGia> sortPGG = new ArrayList<>();
        for(PhieuGiamGia dataE : data){
            if (request.getTongTienHoaDon().compareTo(new BigDecimal(dataE.getDieuKienGiam())) >= 0 && request.getTongTienHoaDon().compareTo(dataE.getGiamToiDa()) >= 0) {
                if(dataE.getPhamTramGiamGia() != null){
                    BigDecimal soTienGiam = dataE.getPhamTramGiamGia()
                            .multiply(request.getTongTienHoaDon())
                            .divide(BigDecimal.valueOf(100));

                    if (soTienGiam.compareTo(dataE.getGiamToiDa()) >= 0) {

                    }
                    else {
                        dataE.setGiamToiDa(soTienGiam);
                    }
                    sortPGG.add(dataE);
                }
                else {
                    sortPGG.add(dataE);
                }
            }
        }
        sortPGG.sort(Comparator.comparing(
                PhieuGiamGia::getGiamToiDa, Comparator.reverseOrder()
        ));
        List<PhieuGiamGia> oldList = new LinkedList<>();

        for(PhieuGiamGia sortDTO : sortPGG){
            if(sortDTO.getPhamTramGiamGia() != null){
                sortDTO.setSoTienGiam(new BigDecimal(0));
                oldList.add(sortDTO);
            }
            else {
                oldList.add(sortDTO);
            }
        }
        List<PhieuGiamGiaDTO> dtoList = oldList.stream()
                .map(PhieuGiamGiaMapper.INSTANCE::toResponse)
                .collect(Collectors.toList());
        if (dtoList.isEmpty()) {
            throw new AppException(ErrorCode.PHIEU_GIAM_GIA_KH_NULL);
        }
        return new PageImpl<>(dtoList, PageRequest.of(1, dtoList.size()), dtoList.size());
    }
    @Override
    public ChiTietPhieuGiamGiaDTO findVoucherByCodeForCustomer(String maPhieu, Integer idKhachHang) {
        ChiTietPhieuGiamGia chiTiet = phieuGiamGiaKhachHangRepository
                .findByPhieuGiamGia_MaPhieuGiamGiaAndKhachHang_Id(maPhieu, idKhachHang)
                .orElseThrow(() -> new AppException(ErrorCode.PHIEU_GIAM_GIA_NULL
                ) );

        // (Tùy chọn) Bạn có thể thêm các kiểm tra khác ở đây, ví dụ:
        // if (chiTiet.getPhieuGiamGia().getNgayKetThuc().isBefore(LocalDate.now())) {
        //     throw new AppException(ErrorCode.VOUCHER_EXPIRED, "Mã giảm giá đã hết hạn.");
        // }

        return ChiTietPhieuGiamGiaMapper.INSTANCE.toResponse(chiTiet);
    }
}
