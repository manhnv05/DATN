package com.example.datn.Service;


import com.example.datn.DTO.*;
import com.example.datn.DTO.HoaDonPdfResult;
import com.example.datn.Entity.ChiTietSanPham;
import com.example.datn.Entity.HoaDon;
import com.example.datn.VO.*;
import com.example.datn.enums.TrangThai;
import lombok.Data;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public interface HoaDonService {
//    HoaDonDTO taoHoaDon(HoaDonCreateVO request);
    HoaDonChoDTO taoHoaDonCho(HoaDonChoRequestVO request);
     HoaDonPdfResult hoadonToPDF(String idHoaDon);
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
    List<HoaDonChiTietDTO> updateDanhSachSanPhamChiTiet(Integer idHoaDon, List<CapNhatSanPhamChiTietDonHangVO> danhSachCapNhatSanPham);


    List<HoaDonChiTietDTO> findChiTietHoaDon(@Param("idHoaDon") Integer idHoaDon);
    String tangSoLuongSanPhamChiTiet(Integer idSanPhamChiTiet, Integer soLuong);
    String giamSoLuongSanPhamChiTiet(Integer idSanPhamChiTiet, Integer soLuong);
    HoaDonDTO updateHoaDon(HoaDonRequestUpdateVO hoaDonRequestUpdateVO);
   void capNhatSoLuongSanPhamTrongKho(HoaDon hoaDon, boolean isDeducting);
   TongTienHoaDonDto getThongTinGiamGiaByHoaDonId(Integer idHoaDon);
   int tinhGiaCuoiCung(ChiTietSanPham spct);
   String  capNhatKhachHangVaoHoaDon(CapNhatKhachRequestVO capNhatKhachRequest);

}
