package com.example.datn.Controller;

import com.example.datn.DTO.KhachHangDTO;
import com.example.datn.Service.KhachHangService;
import com.example.datn.VO.KhachHangQueryVO;
import com.example.datn.VO.KhachHangUpdateVO;
import com.example.datn.VO.KhachHangVO;
import com.example.datn.VO.KhachHangWithDiaChiVO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequestMapping("/khachHang")
public class KhachHangController {

    @Autowired
    private KhachHangService khachHangService;

    /** Thêm mới khách hàng (chỉ thông tin khách hàng, nhận JSON) */
    @PostMapping
    public String save(@Valid @RequestBody KhachHangVO vO) {
        return khachHangService.save(vO).toString();
    }

    /** Thêm đồng thời khách hàng và địa chỉ (nhận JSON theo cấu trúc { khachHang, diaChi }) */
    @PostMapping("/with-address")
    public String saveWithAddress(@Valid @RequestBody KhachHangWithDiaChiVO vO) {
        return khachHangService.saveWithAddress(vO).toString();
    }

    /** Xóa khách hàng theo id */
    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") Integer id) {
        khachHangService.delete(id);
    }

    /** Cập nhật thông tin khách hàng theo id */
    @PutMapping("/{id}")
    public void update(@PathVariable("id") Integer id,
                       @Valid @RequestBody KhachHangUpdateVO vO) {
        khachHangService.update(id, vO);
    }

    /** Lấy thông tin khách hàng theo id */
    @GetMapping("/{id}")
    public KhachHangDTO getById(@PathVariable("id") Integer id) {
        return khachHangService.getById(id);
    }

    /** Lấy danh sách khách hàng có filter và phân trang (dạng query param) */
    @GetMapping
    public Page<KhachHangDTO> query(
            @RequestParam(required = false) Integer id,
            @RequestParam(required = false) String maKhachHang,
            @RequestParam(required = false) String matKhau,
            @RequestParam(required = false) String tenKhachHang,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) Integer gioiTinh,
            @RequestParam(required = false) String sdt,
            @RequestParam(required = false) String ngaySinh,
            @RequestParam(required = false) String hinhAnh,
            @RequestParam(required = false) Integer trangThai,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size
    ) {
        KhachHangQueryVO vO = new KhachHangQueryVO();
        vO.setId(id);
        vO.setMaKhachHang(maKhachHang);
        vO.setMatKhau(matKhau);
        vO.setTenKhachHang(tenKhachHang);
        vO.setEmail(email);
        vO.setGioiTinh(gioiTinh);
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
        vO.setPage(page);
        vO.setSize(size);

        return khachHangService.query(vO);
    }
}