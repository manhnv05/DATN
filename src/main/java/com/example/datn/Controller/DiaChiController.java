package com.example.datn.Controller;

import com.example.datn.DTO.DiaChiDTO;
import com.example.datn.Service.DiaChiService;
import com.example.datn.VO.DiaChiVO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.List;

@RestController
@RequestMapping("/diaChi")
public class DiaChiController {

    @Autowired
    private DiaChiService diaChiService;

    // Thêm địa chỉ mới (nhận JSON, không nhận file)
    @PostMapping
    public String save(@Valid @RequestBody DiaChiVO vO) {
        return diaChiService.save(vO).toString();
    }

    // Lấy danh sách tỉnh/thành phố từ provinces.open-api.vn
    @GetMapping("/hanh-chinh-vn/provinces")
    public Object getAllProvinces() {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://provinces.open-api.vn/api/?depth=1";
        return restTemplate.getForObject(url, Object.class);
    }

    // Lấy danh sách quận/huyện theo mã tỉnh
    @GetMapping("/hanh-chinh-vn/districts/{provinceId}")
    public Object getDistrictsByProvince(@PathVariable("provinceId") String provinceId) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://provinces.open-api.vn/api/p/" + provinceId + "?depth=2";
        return restTemplate.getForObject(url, Object.class);
    }

    // Lấy danh sách phường/xã theo mã quận/huyện
    @GetMapping("/hanh-chinh-vn/wards/{districtId}")
    public Object getWardsByDistrict(@PathVariable("districtId") String districtId) {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://provinces.open-api.vn/api/d/" + districtId + "?depth=2";
        return restTemplate.getForObject(url, Object.class);
    }
    // Lấy tất cả địa chỉ từ database nội bộ
    @GetMapping("/all")
    public List<DiaChiDTO> getAllDiaChi() {
        return diaChiService.findAll();
    }

    @GetMapping("/get-all-dia-chi-by-khach-hang/{idKhachHang}")
    public List<DiaChiDTO> getDiaChiByKhachHang(@PathVariable Integer idKhachHang) {
        return diaChiService.getAllDiaChiByIdKhachHang(idKhachHang);
    }
}
