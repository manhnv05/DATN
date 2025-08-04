package com.example.datn.controller;

import com.example.datn.config.ResponseHelper;
import com.example.datn.dto.ApiResponse;
import com.example.datn.dto.PhieuGiamGiaDTO;
import com.example.datn.service.PhieuGiamGiaService;
import com.example.datn.vo.phieuGiamGiaVO.PhieuGiamGiaVO;
import com.example.datn.vo.phieuGiamGiaVO.PhieuGiamGiaVOUpdate;
import com.example.datn.vo.phieuGiamGiaVO.PhieuGiamVOSearch;
import com.example.datn.vo.phieuGiamGiaVO.SendMailRequestData;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/phieu_giam_gia")
public class PhieuGiamGiaController {

    @Autowired
    private PhieuGiamGiaService phieuGiamGiaService;

    @PostMapping("/findAll")
    public ResponseEntity<ApiResponse<Page<PhieuGiamGiaDTO>>> getAllPhieuGiamGia(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestBody PhieuGiamVOSearch search) {
        return ResponseHelper.success("", phieuGiamGiaService.getAllPhieuGiamGia(page, size, search));
    }

    @PostMapping("")
    public ResponseEntity<ApiResponse<PhieuGiamGiaDTO>> createPhieuGiamGia(
            @Valid @RequestBody PhieuGiamGiaVO request) {
        return ResponseHelper.success("Thêm Phiếu giảm giá thành công", phieuGiamGiaService.createPhieuGiamGia(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PhieuGiamGiaDTO>> getById(@PathVariable int id) {
        return ResponseHelper.success("", phieuGiamGiaService.getPhieuGiamGiaById(id));
    }

    @PutMapping("")
    public ResponseEntity<ApiResponse<PhieuGiamGiaDTO>> updatephieuGiamGia(
            @RequestBody PhieuGiamGiaVOUpdate request) {
        return ResponseHelper.success("", phieuGiamGiaService.updatePhieuGiamGia(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteById(@PathVariable int id) {
        return ResponseEntity.ok(phieuGiamGiaService.deletePhieuGiamGia(id));
    }

    @PostMapping("/updateStatus/{id}")
    public ResponseEntity<ApiResponse<PhieuGiamGiaDTO>> updatePhieuGiamGiaStatus(
            @PathVariable int id, @RequestBody int status) {
        return ResponseHelper.success("", phieuGiamGiaService.updateStatusPhieuGiamGia(id, status));
    }

    @PostMapping("/sendMail")
    public ResponseEntity<ApiResponse<String>> sendMail(@RequestBody SendMailRequestData sendMailRequest) {
        try {
            phieuGiamGiaService.sendMailToListCustomer(sendMailRequest);
            return ResponseHelper.success("Gửi mail thành công", "success");
        } catch (Exception ex) {
            return ResponseHelper.error("Gửi mail thất bại: " + ex.getMessage());
        }
    }
    @PostMapping("/giam-so_luong-pgg/{id}")
    public ResponseEntity<ApiResponse<String>> giamSoLuongSanPhamChiTiet(
            @PathVariable Integer id,
            @RequestParam Integer soLuong,
            @RequestParam Integer idKhachHang
    ) {
        return ResponseHelper.success("",phieuGiamGiaService.giamSoluongPhieuGiamGia(id, soLuong, idKhachHang));
    }
    @PostMapping("/tang-so_luong-pgg/{id}")
    public ResponseEntity<ApiResponse<String>> tangSoLuongSanPhamChiTiet(
            @PathVariable Integer id,
            @RequestParam Integer soLuong) {
        return ResponseHelper.success("",phieuGiamGiaService.tangSoluongPhieuGiamGia(id,soLuong));
    }
}