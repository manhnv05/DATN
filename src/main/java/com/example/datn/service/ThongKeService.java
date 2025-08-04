package com.example.datn.service;

import com.example.datn.dto.*;
import com.example.datn.vo.thongKeVO.ThongKeVoSearch;
import org.springframework.data.domain.Page;

import java.util.Map;

public interface ThongKeService {
    Map<String, ThongKeDTO> getThongKe();

    Page<ThongKeSPBanChayDTO> getThongKeSpBanChayByQuery(ThongKeVoSearch thongKeVoSearch, int page, int size);

    Page<ChiTietSanPhamSapHetDTO> getAllChiTietSanPhamSapHetHan(int page, int size);

    ThongKeBieuDoDTO getBieuDo(int check);

    ThongKeBieuDoDTO getBieuDoByQuery(ThongKeVoSearch thongKeVoSearch);

}
