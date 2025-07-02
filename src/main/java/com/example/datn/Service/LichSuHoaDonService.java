package com.example.datn.Service;

import com.example.datn.DTO.HoaDonHistoryDTO;
import com.example.datn.Entity.HoaDon;
import com.example.datn.Entity.LichSuHoaDon;
import com.example.datn.enums.TrangThai;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public interface LichSuHoaDonService {
    void ghiNhanLichSuHoaDon(HoaDon hoaDon, String noiDungThayDoi, String nguoiThucHien, String ghiChu, TrangThai trangThaiMoi);

    List<HoaDonHistoryDTO> layLichSuThayDoiTrangThai(String maHoaDon);



    HoaDonHistoryDTO layLichSuThayDoiTrangThaiGanNhat (Integer idHoaDon);
}
