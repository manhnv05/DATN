package com.example.datn.controller;

import com.example.datn.config.ResponseHelper;
import com.example.datn.dto.ApiResponse;
import com.example.datn.dto.ChiTietThanhToanDTO;
import com.example.datn.dto.LichSuThanhToanDTO;
import com.example.datn.service.ChiTietThanhToanService;
import com.example.datn.vo.chiTietThanhToanVO.ChiTietThanhToanQueryVO;
import com.example.datn.vo.chiTietThanhToanVO.ChiTietThanhToanResponseVO;
import com.example.datn.vo.chiTietThanhToanVO.ChiTietThanhToanUpdateVO;
import com.example.datn.vo.chiTietThanhToanVO.ChiTietThanhToanVO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Validated
@RestController
@RequestMapping("/chiTietThanhToan")
public class ChiTietThanhToanController {

    @Autowired
    private ChiTietThanhToanService chiTietThanhToanService;

    @PostMapping("")
    public ResponseEntity<ApiResponse<ChiTietThanhToanDTO>> save(@Valid @RequestBody ChiTietThanhToanVO vO) {
        ChiTietThanhToanDTO savedDto = chiTietThanhToanService.save(vO);
        return ResponseHelper.success("Lưu thanh toán thành công", savedDto);
    }

    @DeleteMapping("/{id}")
    public void delete(@Valid @NotNull @PathVariable("id") Integer id) {
        chiTietThanhToanService.delete(id);
    }

    @PutMapping("/{id}")
    public void update(@Valid @NotNull @PathVariable("id") Integer id,
                       @Valid @RequestBody ChiTietThanhToanUpdateVO vO) {
        chiTietThanhToanService.update(id, vO);
    }

    @GetMapping("/{id}")
    public ChiTietThanhToanDTO getById(@Valid @NotNull @PathVariable("id") Integer id) {
        return chiTietThanhToanService.getById(id);
    }

    @GetMapping("/{idHoaDon}/chi-tiet-thanh-toan")
    public ResponseEntity<?> getChiTietThanhToan(@PathVariable("idHoaDon") Integer idHoaDon) {

        List<ChiTietThanhToanResponseVO> responseList = chiTietThanhToanService.getChiTietThanhToanByHoaDonId(idHoaDon);
        return ResponseEntity.ok(responseList);
    }
    @GetMapping("/lich-su-thanh-toan/{idHoaDon}")
    public ResponseEntity<ApiResponse<List<LichSuThanhToanDTO>>> getLichSuThanhToanByHoaDonId(@PathVariable("idHoaDon") Integer idHoaDon) {
        List<LichSuThanhToanDTO>  lichSuThanhToanDTO =   chiTietThanhToanService.findChiTietThanhToanByIdHoaDon(idHoaDon);
        ApiResponse<List<LichSuThanhToanDTO>> response  = ApiResponse.<List<LichSuThanhToanDTO>>builder()
                .code(1000)
                .message("Lịch sử thanh toán đã được lấy thành công")
                .data(lichSuThanhToanDTO)
                .build();
        return ResponseEntity.ok(response);
    }

}
