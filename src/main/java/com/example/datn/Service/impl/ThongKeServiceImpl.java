package com.example.datn.Service.impl;

import com.example.datn.DTO.ThongKeDTO;
import com.example.datn.DTO.ThongKeSPBanChayDTO;
import com.example.datn.Entity.ChiTietSanPham;
import com.example.datn.Entity.HoaDon;
import com.example.datn.Entity.HoaDonChiTiet;
import com.example.datn.Repository.HoaDonChiTietRepository;
import com.example.datn.Repository.SanPhamRepository;
import com.example.datn.Repository.ThongKeRepository;
import com.example.datn.Repository.ThongKeSanPhamRepository;
import com.example.datn.Service.ThongKeService;
import com.example.datn.VO.ThongKeVoSearch;
import com.example.datn.enums.TrangThai;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ThongKeServiceImpl implements ThongKeService {
    @Autowired
    private ThongKeRepository thongKeRepository;

    @Autowired
    private HoaDonChiTietRepository hoaDonChiTietRepository;

    @Autowired
    private ThongKeSanPhamRepository thongKeSanPhamRepository;

    @Override
    public Map<String, ThongKeDTO> getThongKe() {
        Map<String, ThongKeDTO> thongKeDTOMap = new HashMap<>();
        List<HoaDon> hoaDons = thongKeRepository.getThongKeHomNay();
        List<HoaDon> hoaDonsCuaTuanNay = thongKeRepository.getThongKeTuanNay();
        List<HoaDon> hoaDonsCuaThangNay = thongKeRepository.getThongKeThangNay();
        List<HoaDon> hoaDonsCuaNamNay = thongKeRepository.getThongKeNamNay();
        thongKeDTOMap.put("homNay", getThongKeByHoaDons(hoaDons));
        thongKeDTOMap.put("tuanNay", getThongKeByHoaDons(hoaDonsCuaTuanNay));
        thongKeDTOMap.put("thangNay", getThongKeByHoaDons(hoaDonsCuaThangNay));
        thongKeDTOMap.put("namNay", getThongKeByHoaDons(hoaDonsCuaNamNay));
        return thongKeDTOMap;
    }

    @Override
    public Page<ThongKeSPBanChayDTO> getThongKeSpBanChayByQuery(ThongKeVoSearch thongKeVoSearch, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        if (thongKeVoSearch.getBoLocNgayTuanThangNam() == 0){
            Page<HoaDonChiTiet> hoaDoncts = thongKeSanPhamRepository.getThongKeHomNay(pageable);
            return getSanPhamCt(hoaDoncts);
        }
        else if(thongKeVoSearch.getBoLocNgayTuanThangNam() == 1){
            Page<HoaDonChiTiet> hoaDons = thongKeSanPhamRepository.getThongKeTuanNay(pageable);
            return getSanPhamCt(hoaDons);
        }
        else if(thongKeVoSearch.getBoLocNgayTuanThangNam() == 2){
            Page<HoaDonChiTiet> hoaDons = thongKeSanPhamRepository.getThongKeThangNay(pageable);
            return getSanPhamCt(hoaDons);
        }
        else if(thongKeVoSearch.getBoLocNgayTuanThangNam() == 3){
            Page<HoaDonChiTiet> hoaDons = thongKeSanPhamRepository.getThongKeNamNay(pageable);
            return getSanPhamCt(hoaDons);
        }
        else {
            Page<HoaDonChiTiet> hoaDons = thongKeSanPhamRepository.getAllByQuery(thongKeVoSearch, pageable);
            return getSanPhamCt(hoaDons);
        }
    }

    public Page<ThongKeSPBanChayDTO> getSanPhamCt(Page<HoaDonChiTiet> hoaDonChiTietPage) {
        List<HoaDonChiTiet> hoaDonChiTietList = hoaDonChiTietPage.getContent();

        Map<Integer, ChiTietSanPham> mapChiTietSanPham = new HashMap<>();

        for (HoaDonChiTiet hdct : hoaDonChiTietList) {
            if (hdct.getHoaDon().getTrangThai() == TrangThai.HOAN_THANH) {
                ChiTietSanPham chiTietSanPham = hdct.getSanPhamChiTiet();
                Integer id = chiTietSanPham.getId();

                if (mapChiTietSanPham.containsKey(id)) {
                    ChiTietSanPham existing = mapChiTietSanPham.get(id);
                    existing.setSoLuong(existing.getSoLuong() + hdct.getSoLuong());
                } else {
                    ChiTietSanPham newCtsp = new ChiTietSanPham();
                    newCtsp.setId(chiTietSanPham.getId());
                    newCtsp.setSanPham(chiTietSanPham.getSanPham());
                    newCtsp.setKichThuoc(chiTietSanPham.getKichThuoc());
                    newCtsp.setGia(chiTietSanPham.getGia());
                    newCtsp.setSoLuong(hdct.getSoLuong());
                    mapChiTietSanPham.put(id, newCtsp);
                }
            }
        }

        List<ChiTietSanPham> mergedList = new ArrayList<>(mapChiTietSanPham.values());
        mergedList.sort((a, b) -> Integer.compare(b.getSoLuong(), a.getSoLuong()));

        List<ThongKeSPBanChayDTO> result = mergedList.stream()
                .map(ctsp -> {
                    ThongKeSPBanChayDTO dto = new ThongKeSPBanChayDTO();
                    dto.setTenSp(ctsp.getSanPham().getTenSanPham());
                    dto.setGiaTien(ctsp.getGia());
                    dto.setKichCo(ctsp.getKichThuoc().getTenKichCo());
                    dto.setSoLuong(ctsp.getSoLuong());
                    return dto;
                })
                .toList();

        return new PageImpl<>(result, hoaDonChiTietPage.getPageable(), hoaDonChiTietPage.getTotalElements());
    }

    public ThongKeDTO getThongKeByHoaDons(List<HoaDon> hoaDons) {
        BigDecimal totalRevenue = BigDecimal.ZERO;
        int totalProducts = 0;
        int completedOrders = 0;
        int cancelledOrders = 0;
        for (HoaDon hd : hoaDons) {
            if (hd.getTrangThai() == TrangThai.HOAN_THANH) {
                totalRevenue = totalRevenue.add(hd.getTongTien() != null ? BigDecimal.valueOf(hd.getTongTien()) : BigDecimal.ZERO);
                List<HoaDonChiTiet> hoaDonChiTietList = hoaDonChiTietRepository.findAllByHoaDon_Id(hd.getId());
                for (HoaDonChiTiet item : hoaDonChiTietList) {
                    totalProducts += item.getSoLuong();
                }
                completedOrders++;
            }
            else if (hd.getTrangThai() == TrangThai.HUY) {
                cancelledOrders++;
            }
        }
        return new ThongKeDTO(totalRevenue, totalProducts, cancelledOrders, completedOrders);
    }
}
