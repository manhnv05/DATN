package com.example.datn.controller;

import com.example.datn.dto.ChiTietThanhToanDTO;
import com.example.datn.service.ChiTietThanhToanService;
import com.example.datn.vo.chiTietThanhToanVO.ChiTietThanhToanQueryVO;
import com.example.datn.vo.chiTietThanhToanVO.ChiTietThanhToanUpdateVO;
import com.example.datn.vo.chiTietThanhToanVO.ChiTietThanhToanVO;
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
@RequestMapping("/chiTietThanhToan")
public class ChiTietThanhToanController {

    @Autowired
    private ChiTietThanhToanService chiTietThanhToanService;

    @PostMapping
    public String save(@Valid @RequestBody ChiTietThanhToanVO vO) {
        return chiTietThanhToanService.save(vO).toString();
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

    @GetMapping
    public Page<ChiTietThanhToanDTO> query(@Valid ChiTietThanhToanQueryVO vO) {
        return chiTietThanhToanService.query(vO);
    }
}
