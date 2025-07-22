package com.example.datn.Controller;

import com.example.datn.Config.ResponseHelper;
import com.example.datn.DTO.ApiResponse;
import com.example.datn.DTO.ChiTietPhieuGiamGiaDTO;
import com.example.datn.DTO.PhieuGiamGiaDTO;
import com.example.datn.Service.ChiTietPhieuGiamGiaService;
import com.example.datn.VO.ChiTietPhieuGiamGiaUpdateVO;
import com.example.datn.VO.ChiTietPhieuGiamGiaVO;
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
    public ResponseEntity<ApiResponse<Page<PhieuGiamGiaDTO>>> queryPhieuGiamGiaKhachHang(
            @RequestBody ChiTietPhieuGiamGiaVO request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        if (size <= 0) {
            size = 10;
        }
        return ResponseHelper.success("", phieuGiamGiaKhachHangService.queryPhieuGiamGiaKhachHang(page, size,request));
    }

    @PostMapping("/pddkh")
    public ResponseEntity<ApiResponse<Page<ChiTietPhieuGiamGiaDTO>>> pddkh(
            @RequestBody ChiTietPhieuGiamGiaVO request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseHelper.success("", phieuGiamGiaKhachHangService.getpggkh(page, size,request));
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
    @GetMapping("/find-by-code")
    public ResponseEntity<ApiResponse<ChiTietPhieuGiamGiaDTO>> findByCode(
            @RequestParam String maPhieu,
            @RequestParam Integer idKhachHang
    ) {
        return ResponseHelper.success("Tìm thấy phiếu giảm giá.",
                phieuGiamGiaKhachHangService.findVoucherByCodeForCustomer(maPhieu, idKhachHang));
    }
}
