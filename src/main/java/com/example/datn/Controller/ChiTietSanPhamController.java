package com.example.datn.Controller;

import com.example.datn.DTO.ChiTietSanPhamDTO;
import com.example.datn.Service.ChiTietSanPhamService;
import com.example.datn.VO.ChiTietSanPhamQueryVO;
import com.example.datn.VO.ChiTietSanPhamUpdateVO;
import com.example.datn.VO.ChiTietSanPhamVO;
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
@RequestMapping("/chiTietSanPham")
public class ChiTietSanPhamController {

    @Autowired
    private ChiTietSanPhamService chiTietSanPhamService;

    @PostMapping
    public String save(@Valid @RequestBody ChiTietSanPhamVO vO) {
        return chiTietSanPhamService.save(vO).toString();
    }

    @DeleteMapping("/{id}")
    public void delete(@Valid @NotNull @PathVariable("id") Integer id) {
        chiTietSanPhamService.delete(id);
    }

    @PutMapping("/{id}")
    public void update(@Valid @NotNull @PathVariable("id") Integer id,
                       @Valid @RequestBody ChiTietSanPhamUpdateVO vO) {
        chiTietSanPhamService.update(id, vO);
    }

    @GetMapping("/{id}")
    public ChiTietSanPhamDTO getById(@Valid @NotNull @PathVariable("id") Integer id) {
        return chiTietSanPhamService.getById(id);
    }

    @GetMapping
    public Page<ChiTietSanPhamDTO> query(@Valid ChiTietSanPhamQueryVO vO) {
        return chiTietSanPhamService.query(vO);
    }
}
