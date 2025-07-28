package com.example.datn.controller;

import com.example.datn.dto.DiaChiDTO;
import com.example.datn.service.DiaChiService;
import com.example.datn.vo.diaChiVO.DiaChiVO;
import com.example.datn.service.DiaChiService;
import com.example.datn.vo.diaChiVO.DiaChiVO;
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

    // Lấy danh sách tỉnh/thành phố và phường/xã (không cần quận/huyện)
    @GetMapping("/hanh-chinh-vn/provinces-wards")
    public Object getProvincesAndWards() {
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://vietnamlabs.com/api/vietnamprovince/province";
        return restTemplate.getForObject(url, Object.class);
    }

    // Lấy tất cả địa chỉ từ database nội bộ
    @GetMapping("/all")
    public List<DiaChiDTO> getAllDiaChi() {
        return diaChiService.findAll();
    }
}