package com.example.datn.service;

import com.example.datn.dto.HoaDonHistoryDTO;
import com.example.datn.entity.HoaDon;
import com.example.datn.enums.TrangThai;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface LichSuHoaDonService {
    void ghiNhanLichSuHoaDon(HoaDon hoaDon, String noiDungThayDoi, String nguoiThucHien, String ghiChu, TrangThai trangThaiMoi);

    List<HoaDonHistoryDTO> layLichSuThayDoiTrangThai(String maHoaDon);



    HoaDonHistoryDTO layLichSuThayDoiTrangThaiGanNhat (Integer idHoaDon);
}
