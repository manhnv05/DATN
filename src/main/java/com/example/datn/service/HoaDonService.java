package com.example.datn.service;


import com.example.datn.dto.CapNhatTrangThaiDTO;
import com.example.datn.dto.HoaDonChiTietDTO;
import com.example.datn.dto.HoaDonDTO;
import com.example.datn.dto.HoaDonHistoryDTO;
import com.example.datn.vo.hoaDonVO.HoaDonCreateVO;
import com.example.datn.vo.hoaDonVO.HoaDonUpdateVO;
import com.example.datn.enums.TrangThai;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public interface HoaDonService {
    HoaDonDTO taoHoaDon(HoaDonCreateVO request);
    CapNhatTrangThaiDTO capNhatTrangThaiHoaDon(Integer idHoaDon, TrangThai trangThaiMoi, String ghiChu, String nguoiThucHien);
    CapNhatTrangThaiDTO capNhatTrangThaiHoaDonKhiQuayLai(Integer idHoaDon, TrangThai trangThaiMoi, String ghiChu, String nguoiThucHien);
    List<HoaDonHistoryDTO> layLichSuThayDoiTrangThai(String  maHoaDon);
    HoaDonDTO getHoaDonById(Integer id);
    Page<HoaDonDTO> getFilteredHoaDon(
                                            TrangThai trangThai,
                                            String loaiHoaDon,
                                            LocalDate ngayTaoStart,
                                            LocalDate ngayTaoEnd,
                                            String searchTerm,
                                            Pageable pageable);
    public Map<TrangThai,Long> getStatusCounts();

    CapNhatTrangThaiDTO chuyenTrangThaiTiepTheo(Integer idHoaDon, String ghiChu, String nguoiThucHien);
    CapNhatTrangThaiDTO huyHoaDon(Integer idHoaDon, String ghiChu, String nguoiThucHien);
    public CapNhatTrangThaiDTO quayLaiTrangThaiTruoc(Integer idHoaDon, String ghiChu, String nguoiThucHien);
    String  capNhatThongTinHoaDon(Integer idHoaDon, HoaDonUpdateVO request);
    // Sửa lại alias (AS) để tên tường minh và dễ ánh xạ

    List<HoaDonChiTietDTO> findChiTietHoaDon(@Param("idHoaDon") Integer idHoaDon);

}
