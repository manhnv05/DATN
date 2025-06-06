package com.example.datn.Controller;

import com.example.datn.DTO.HoaDonChiTietDTO;
import com.example.datn.Service.HoaDonChiTietService;
import com.example.datn.VO.HoaDonChiTietQueryVO;
import com.example.datn.VO.HoaDonChiTietUpdateVO;
import com.example.datn.VO.HoaDonChiTietVO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/hoaDonChiTiet")
public class HoaDonChiTietController {

    @Autowired
    private HoaDonChiTietService hoaDonChiTietService;

    @PostMapping
    public String save(@Valid @RequestBody HoaDonChiTietVO vO) {
        return hoaDonChiTietService.save(vO).toString();
    }

    @DeleteMapping("/{id}")
    public void delete(@Valid @NotNull @PathVariable("id") Integer id) {
        hoaDonChiTietService.delete(id);
    }

    @PutMapping("/{id}")
    public void update(@Valid @NotNull @PathVariable("id") Integer id,
                       @Valid @RequestBody HoaDonChiTietUpdateVO vO) {
        hoaDonChiTietService.update(id, vO);
    }

    @GetMapping("/{id}")
    public HoaDonChiTietDTO getById(@Valid @NotNull @PathVariable("id") Integer id) {
        return hoaDonChiTietService.getById(id);
    }

    @GetMapping
    public Page<HoaDonChiTietDTO> query(@Valid HoaDonChiTietQueryVO vO) {
        return hoaDonChiTietService.query(vO);
    }
}
