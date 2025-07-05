package com.example.datn.Service.impl;

import com.example.datn.DTO.HoaDonHistoryDTO;
import com.example.datn.Entity.HoaDon;
import com.example.datn.Entity.LichSuHoaDon;
import com.example.datn.Repository.LichSuHoaDonRepository;
import com.example.datn.Service.LichSuHoaDonService;
import com.example.datn.mapper.LichSuHoaDonMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import com.example.datn.enums.TrangThai;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LichSuHoaDonServiceImpl implements LichSuHoaDonService {

    LichSuHoaDonRepository lichSuHoaDonRepository;
    LichSuHoaDonMapper lichSuHoaDonMapper;

    @Override
    public void ghiNhanLichSuHoaDon(HoaDon hoaDon, String noiDungThayDoi, String nguoiThucHien, String ghiChu, TrangThai trangThaiMoi) {
        LichSuHoaDon lichSu = LichSuHoaDon.builder()
                .hoaDon(hoaDon)
                .maLichSu("LSHD-" + System.nanoTime())
                .noiDungThayDoi(noiDungThayDoi)
                .nguoiThucHien(nguoiThucHien)
                .ghiChu(ghiChu)
                .trangThai(hoaDon.getTrangThai().ordinal())
                .thoiGianThayDoi(LocalDateTime.now())
                .trangThaiMoiHoaDon(trangThaiMoi.name())
                .build();
        lichSuHoaDonRepository.save(lichSu);
    }

    @Override
    public List<HoaDonHistoryDTO> layLichSuThayDoiTrangThai(String maHoaDon) {
        List<LichSuHoaDon> lichSuList = lichSuHoaDonRepository.findByHoaDon_MaHoaDonOrderByThoiGianThayDoiDesc(maHoaDon);
        return lichSuList.stream()
                .map(lichSuHoaDonMapper::toHoaDonHistoryResponse)
                .collect(Collectors.toList());
    }

    @Override
    public HoaDonHistoryDTO layLichSuThayDoiTrangThaiGanNhat(Integer idHoaDon) {
        HoaDonHistoryDTO lichSuGanNhat = lichSuHoaDonRepository.findTrangThaiGanNhatCuaHoaDon(idHoaDon);
        return lichSuGanNhat;
    }
}
