package com.example.datn.Service;

import com.example.datn.DTO.ThongKeDTO;
import com.example.datn.DTO.ThongKeSPBanChayDTO;
import com.example.datn.Entity.ChiTietSanPham;
import com.example.datn.VO.ThongKeVoSearch;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Map;

public interface ThongKeService {
    Map<String, ThongKeDTO> getThongKe();

    Page<ThongKeSPBanChayDTO> getThongKeSpBanChayByQuery(ThongKeVoSearch thongKeVoSearch, int page, int size);
}
