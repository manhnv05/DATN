package com.example.datn.controller;

import com.example.datn.dto.HinhThucThanhToanDTO;
import com.example.datn.service.HinhThucThanhToanService;
import com.example.datn.vo.hinhThucThanhToanVO.HinhThucThanhToanQueryVO;
import com.example.datn.vo.hinhThucThanhToanVO.HinhThucThanhToanUpdateVO;
import com.example.datn.vo.hinhThucThanhToanVO.HinhThucThanhToanVO;
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
@RequestMapping("/hinhThucThanhToan")
public class HinhThucThanhToanController {

    @Autowired
    private HinhThucThanhToanService hinhThucThanhToanService;

    @PostMapping
    public String save(@Valid @RequestBody HinhThucThanhToanVO vO) {
        return hinhThucThanhToanService.save(vO).toString();
    }

    @DeleteMapping("/{id}")
    public void delete(@Valid @NotNull @PathVariable("id") Integer id) {
        hinhThucThanhToanService.delete(id);
    }

    @PutMapping("/{id}")
    public void update(@Valid @NotNull @PathVariable("id") Integer id,
                       @Valid @RequestBody HinhThucThanhToanUpdateVO vO) {
        hinhThucThanhToanService.update(id, vO);
    }

    @GetMapping("/{id}")
    public HinhThucThanhToanDTO getById(@Valid @NotNull @PathVariable("id") Integer id) {
        return hinhThucThanhToanService.getById(id);
    }

    @GetMapping
    public Page<HinhThucThanhToanDTO> query(@Valid HinhThucThanhToanQueryVO vO) {
        return hinhThucThanhToanService.query(vO);
    }
}
