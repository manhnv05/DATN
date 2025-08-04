package com.example.datn.controller;

import com.example.datn.dto.KhachHangDTO;
import com.example.datn.service.KhachHangService;
import com.example.datn.vo.khachHangVO.KhachHangQueryVO;
import com.example.datn.vo.khachHangVO.KhachHangUpdateVO;
import com.example.datn.vo.khachHangVO.KhachHangVO;
import com.example.datn.vo.khachHangVO.KhachHangWithDiaChiVO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Validated
@RestController
@RequestMapping("/khachHang")
public class KhachHangController {

    @Autowired
    private KhachHangService khachHangService;

    /** Thêm mới khách hàng (chỉ thông tin khách hàng, nhận JSON) */
    @PostMapping(consumes = {"multipart/form-data"})
    public String save(
            @RequestPart("vO") @Valid KhachHangVO vO,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile
    ) {
        return khachHangService.save(vO, imageFile).toString();
    }

    /** Thêm đồng thời khách hàng và địa chỉ (nhận multipart: vO là json, imageFile là ảnh) */
    @PostMapping(value = "/with-address", consumes = {"multipart/form-data"})
    public String saveWithAddress(
            @RequestPart("vO") @Valid KhachHangWithDiaChiVO vO,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile
    ) {
        return khachHangService.saveWithAddress(vO, imageFile).toString();
    }

    /** Xóa khách hàng theo id */
    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") Integer id) {
        khachHangService.delete(id);
    }

    /** Cập nhật thông tin khách hàng theo id (multipart hỗ trợ đổi ảnh) */
    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public void update(
            @PathVariable("id") Integer id,
            @RequestPart("vO") @Valid KhachHangUpdateVO vO,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile
    ) {
        khachHangService.update(id, vO, imageFile);
    }

    /** Lấy thông tin khách hàng theo id, trả về cả danh sách địa chỉ */
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable("id") Integer id) {
        KhachHangDTO kh = khachHangService.getById(id);
        return ResponseEntity.ok().body(java.util.Map.of("data", kh));
    }

    /** Lấy danh sách khách hàng có filter và phân trang (dạng query param) */
    @GetMapping
    public Page<KhachHangDTO> query(
            @RequestParam(required = false) Integer id,
            @RequestParam(required = false) String maKhachHang,
            @RequestParam(required = false) String matKhau,
            @RequestParam(required = false) String tenKhachHang,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) Integer gioiTinh, // Integer (0-Nữ, 1-Nam, 2-Khác)
            @RequestParam(required = false) String sdt,
            @RequestParam(required = false) String ngaySinh,
            @RequestParam(required = false) String hinhAnh,
            @RequestParam(required = false) Integer trangThai,
            @RequestParam(required = false) Integer minAge,   // Thêm nếu filter khoảng tuổi
            @RequestParam(required = false) Integer maxAge,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size
    ) {
        KhachHangQueryVO vO = new KhachHangQueryVO();
        vO.setId(id);
        vO.setMaKhachHang(maKhachHang);
        vO.setMatKhau(matKhau);
        vO.setTenKhachHang(tenKhachHang);
        vO.setEmail(email);
        vO.setGioiTinh(gioiTinh); // Đúng kiểu Integer

        vO.setSdt(sdt);

        // Xử lý ngày sinh
        if (ngaySinh != null && !ngaySinh.isEmpty()) {
            try {
                vO.setNgaySinh(java.sql.Date.valueOf(ngaySinh));
            } catch (Exception ignored) {
                vO.setNgaySinh(null);
            }
        } else {
            vO.setNgaySinh(null);
        }

        vO.setHinhAnh(hinhAnh);
        vO.setTrangThai(trangThai);

        // Xử lý filter khoảng tuổi
        vO.setMinAge(minAge);
        vO.setMaxAge(maxAge);

        vO.setPage(page);
        vO.setSize(size);

        return khachHangService.query(vO);
    }
}