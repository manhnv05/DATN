package com.example.datn.controller;

import com.example.datn.config.ResponseHelper;
import com.example.datn.dto.*;
import com.example.datn.service.ThongKeService;
import com.example.datn.vo.thongKeVO.ThongKeVoSearch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/thong_ke")
public class ThongKeController {
    @Autowired
    private ThongKeService thongKeService;

    @GetMapping("")
    public ResponseEntity<ApiResponse<Map<String, ThongKeDTO>>> getThongKe() {
       return ResponseHelper.success("", thongKeService.getThongKe());
    }

    @GetMapping("/sanPhamSapHet")
    public ResponseEntity<ApiResponse<Page<ChiTietSanPhamSapHetDTO>>> getSanPhamSapHet(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseHelper.success("", thongKeService.getAllChiTietSanPhamSapHetHan(page, size));
    }

    @PostMapping("")
    public ResponseEntity<ApiResponse<Page<ThongKeSPBanChayDTO>>> addThongKe(
            @RequestBody ThongKeVoSearch thongKeVoSearch,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseHelper.success("", thongKeService.getThongKeSpBanChayByQuery(thongKeVoSearch, page, size));
    }

    @GetMapping("/bieudo/{id}")
    public ResponseEntity<ApiResponse<ThongKeBieuDoDTO>> getBieudo(@PathVariable int id) {
        return ResponseHelper.success("", thongKeService.getBieuDo(id));
    }
    @PostMapping("/bieudo")
    public ResponseEntity<ApiResponse<ThongKeBieuDoDTO>> getBieuDoQuery(@RequestBody ThongKeVoSearch thongKeVoSearch) {
        return ResponseHelper.success("", thongKeService.getBieuDoByQuery(thongKeVoSearch));
    }
}
