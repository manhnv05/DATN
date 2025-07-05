package com.example.datn.controller;

import com.example.datn.config.ResponseHelper;
import com.example.datn.dto.ApiResponse;
import com.example.datn.dto.ChiTietPhieuGiamGiaDTO;
import com.example.datn.service.ChiTietPhieuGiamGiaService;
import com.example.datn.vo.chiTietPhieuGiamGiaVO.ChiTietPhieuGiamGiaUpdateVO;
import com.example.datn.vo.chiTietPhieuGiamGiaVO.ChiTietPhieuGiamGiaVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/PhieuGiamGiaKhachHang")
public class ChiTietPhieuGiamGiaController {
    @Autowired
    private ChiTietPhieuGiamGiaService phieuGiamGiaKhachHangService;

    @PostMapping("/query")
    public ResponseEntity<ApiResponse<Page<ChiTietPhieuGiamGiaDTO>>> queryPhieuGiamGiaKhachHang(
            @RequestBody ChiTietPhieuGiamGiaVO request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseHelper.success("", phieuGiamGiaKhachHangService.queryPhieuGiamGiaKhachHang(page, size,request));
    }

    @PostMapping("")
    public ResponseEntity<ApiResponse<List<ChiTietPhieuGiamGiaDTO>>> create(@RequestBody List<ChiTietPhieuGiamGiaVO> listRequest) {
        return ResponseHelper
                .success("", phieuGiamGiaKhachHangService.createPhieuGiamGiaKhachHang(listRequest));
    }
    @PutMapping("")
    public ResponseEntity<ApiResponse<List<ChiTietPhieuGiamGiaDTO>>> update(@RequestBody List<ChiTietPhieuGiamGiaUpdateVO> listRequest) {
        return ResponseHelper
                .success("", phieuGiamGiaKhachHangService.updatePhieuGiamGiaKhachHang(listRequest));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        return ResponseHelper
                .success("", phieuGiamGiaKhachHangService.deletePhieuGiamGiaKhachHang(id));
    }
}
