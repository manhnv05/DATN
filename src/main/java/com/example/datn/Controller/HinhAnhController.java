package com.example.datn.Controller;

import com.example.datn.DTO.HinhAnhDTO;
import com.example.datn.Service.HinhAnhService;
import com.example.datn.VO.HinhAnhQueryVO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

@Validated
@RestController
@RequestMapping("/hinhAnh")
public class HinhAnhController {

    @Autowired
    private HinhAnhService hinhAnhService;

    // ✅ Tạo mới hình ảnh
    @PostMapping
    public ResponseEntity<?> save(
            @RequestParam("ma_anh") String maAnh,
            @RequestParam(value = "duong_dan_anh", required = false) MultipartFile duongDanAnh,
            @RequestParam("anh_mac_dinh") Integer anhMacDinh,
            @RequestParam("mo_ta") String moTa,
            @RequestParam("trang_thai") Integer trangThai
            // @RequestParam(value = "id_san_pham_chi_tiet", required = false) Integer idSanPhamChiTiet
    ) {
        Integer id = hinhAnhService.save(maAnh, anhMacDinh, moTa, trangThai, duongDanAnh);
        return ResponseEntity.ok(id);
    }

    // ✅ Xóa hình ảnh theo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@Valid @NotNull @PathVariable("id") Integer id) {
        hinhAnhService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ Cập nhật hình ảnh
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @Valid @NotNull @PathVariable("id") Integer id,
            @RequestParam("ma_anh") String maAnh,
            @RequestParam(value = "duong_dan_anh", required = false) MultipartFile duongDanAnh,
            @RequestParam("anh_mac_dinh") Integer anhMacDinh,
            @RequestParam("mo_ta") String moTa,
            @RequestParam("trang_thai") Integer trangThai
            // @RequestParam(value = "id_san_pham_chi_tiet", required = false) Integer idSanPhamChiTiet
    ) {
        hinhAnhService.update(id, maAnh, anhMacDinh, moTa, trangThai, duongDanAnh);
        return ResponseEntity.noContent().build();
    }

    // ✅ Lấy chi tiết hình ảnh theo ID
    @GetMapping("/{id}")
    public ResponseEntity<HinhAnhDTO> getById(@Valid @NotNull @PathVariable("id") Integer id) {
        return ResponseEntity.ok(hinhAnhService.getById(id));
    }

    // ✅ Danh sách hình ảnh có phân trang và lọc
    @GetMapping
    public Page<HinhAnhDTO> query(
            @RequestParam(required = false) Integer id,
            @RequestParam(required = false) Integer idSanPhamChiTiet,
            @RequestParam(required = false) String maAnh,
            @RequestParam(required = false) String duongDanAnh,
            @RequestParam(required = false) Integer anhMacDinh,
            @RequestParam(required = false) String moTa,
            @RequestParam(required = false) Integer trangThai,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size
    ) {
        HinhAnhQueryVO vO = new HinhAnhQueryVO();
        vO.setId(id);
        vO.setIdSanPhamChiTiet(idSanPhamChiTiet);
        vO.setMaAnh(maAnh);
        vO.setDuongDanAnh(duongDanAnh);
        vO.setAnhMacDinh(anhMacDinh);
        vO.setMoTa(moTa);
        vO.setTrangThai(trangThai);
        vO.setPage(page);
        vO.setSize(size);
        return hinhAnhService.query(vO);
    }
}
