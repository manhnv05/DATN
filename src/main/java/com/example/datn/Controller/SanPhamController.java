package com.example.datn.Controller;

import com.example.datn.DTO.SanPhamDTO;
import com.example.datn.Service.SanPhamService;
import com.example.datn.VO.SanPhamQueryVO;
import com.example.datn.VO.SanPhamUpdateVO;
import com.example.datn.VO.SanPhamVO;
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
@RequestMapping("/sanPham")
public class SanPhamController {

    @Autowired
    private SanPhamService sanPhamService;

    @PostMapping
    public String save(@Valid @RequestBody SanPhamVO vO) {
        return sanPhamService.save(vO).toString();
    }

    @DeleteMapping("/{id}")
    public void delete(@Valid @NotNull @PathVariable("id") Integer id) {
        sanPhamService.delete(id);
    }

    @PutMapping("/{id}")
    public void update(@Valid @NotNull @PathVariable("id") Integer id,
                       @Valid @RequestBody SanPhamUpdateVO vO) {
        sanPhamService.update(id, vO);
    }

    @GetMapping("/{id}")
    public SanPhamDTO getById(@Valid @NotNull @PathVariable("id") Integer id) {
        return sanPhamService.getById(id);
    }

    @GetMapping
    public Page<SanPhamDTO> query(@Valid SanPhamQueryVO vO) {
        return sanPhamService.query(vO);
    }
}
