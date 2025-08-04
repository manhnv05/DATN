package com.example.datn.controller;

import com.example.datn.dto.DiaChiDTO;
import com.example.datn.service.DiaChiService;
import com.example.datn.vo.diaChiVO.DiaChiVO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
public class DiaChiController {

    @Autowired
    private DiaChiService diaChiService;

    // --- Các API gốc ---

    // Thêm địa chỉ mới
    @PostMapping("/diaChi")
    public String save(@Valid @RequestBody DiaChiVO vO) {
        return diaChiService.save(vO).toString();
    }

    // Sửa địa chỉ
    @PutMapping("/diaChi/{id}")
    public String update(@PathVariable Integer id, @Valid @RequestBody DiaChiVO vO) {
        return diaChiService.update(id, vO).toString();
    }

    // Xóa địa chỉ
    @DeleteMapping("/diaChi/{id}")
    public void delete(@PathVariable Integer id) {
        diaChiService.delete(id);
    }

    // Lấy địa chỉ theo id
    @GetMapping("/diaChi/{id}")
    public DiaChiDTO getDiaChiById(@PathVariable Integer id) {
        return diaChiService.findById(id);
    }

    // Lấy danh sách địa chỉ theo id khách hàng
    @GetMapping("/diaChi/khachhang/{khachHangId}")
    public List<DiaChiDTO> getDiaChiByKhachHangId(@PathVariable Integer khachHangId) {
        return diaChiService.findByKhachHangId(khachHangId);
    }

    // Lấy tất cả địa chỉ từ database nội bộ
    @GetMapping("/diaChi/all")
    public List<DiaChiDTO> getAllDiaChi() {
        return diaChiService.findAll();
    }

    // Lấy danh sách tỉnh/thành phố và phường/xã (không cần quận/huyện)
    @GetMapping("/diaChi/hanh-chinh-vn/provinces-wards")
    public Object getProvincesAndWards() {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://vietnamlabs.com/api/vietnamprovince/province";
        return restTemplate.getForObject(url, Object.class);
    }


    // --- Các API dành cho FE gọi theo dạng /khachHang/... ---

    // Lấy danh sách địa chỉ của khách hàng (FE dùng)
    @GetMapping("/khachHang/{customerId}/diaChis")
    public Map<String, Object> getAllByKhachHang(@PathVariable Integer customerId) {
        List<DiaChiDTO> result = diaChiService.findByKhachHangId(customerId);
        Map<String, Object> res = new HashMap<>();
        res.put("data", result);
        return res;
    }

    // Thêm địa chỉ cho khách hàng (FE dùng)
    @PostMapping("/khachHang/{customerId}/diaChi")
    public Map<String, Object> addDiaChi(@PathVariable Integer customerId, @RequestBody DiaChiVO vo) {
        vo.setIdKhachHang(customerId);
        Integer id = diaChiService.save(vo);
        Map<String, Object> res = new HashMap<>();
        res.put("data", id);
        return res;
    }

    // Sửa địa chỉ của khách hàng (FE dùng)
    @PatchMapping("/khachHang/{customerId}/diaChi/{addressId}")
    public Map<String, Object> updateDiaChi(@PathVariable Integer customerId, @PathVariable Integer addressId, @RequestBody DiaChiVO vo) {
        vo.setIdKhachHang(customerId);
        Integer id = diaChiService.update(addressId, vo);
        Map<String, Object> res = new HashMap<>();
        res.put("data", id);
        return res;
    }

    // Xóa địa chỉ của khách hàng (FE dùng)
    @DeleteMapping("/khachHang/{customerId}/diaChi/{addressId}")
    public void deleteDiaChi(@PathVariable Integer customerId, @PathVariable Integer addressId) {
        diaChiService.delete(addressId);
    }

    // Đặt địa chỉ mặc định (FE dùng)
    @PatchMapping("/khachHang/{customerId}/diaChi/{addressId}/setDefault")
    public void setDefault(@PathVariable Integer customerId, @PathVariable Integer addressId) {
        diaChiService.setDefaultAddress(customerId, addressId);
    }

    // API lấy danh sách tỉnh/thành FE gọi (giống FE endpoint)
//    @GetMapping("/api/vietnamlabs/province")
//    public Object getProvincesFE() {
//        RestTemplate restTemplate = new RestTemplate();
//        String url = "https://vietnamlabs.com/api/vietnamprovince/province";
//        return restTemplate.getForObject(url, Object.class);
//    }
}