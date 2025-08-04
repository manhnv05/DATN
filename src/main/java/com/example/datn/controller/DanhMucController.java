package com.example.datn.controller;

import com.example.datn.dto.DanhMucDTO;
import com.example.datn.service.DanhMucService;
import com.example.datn.vo.danhMucVO.DanhMucQueryVO;
import com.example.datn.vo.danhMucVO.DanhMucUpdateVO;
import com.example.datn.vo.danhMucVO.DanhMucVO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated
@RestController
@RequestMapping("/danhMuc")
public class DanhMucController {

    @Autowired
    private DanhMucService danhMucService;

    @PostMapping
    public String save(@Valid @RequestBody DanhMucVO vO) {
        return danhMucService.save(vO).toString();
    }

    @DeleteMapping("/{id}")
    public void delete(@Valid @NotNull @PathVariable("id") Integer id) {
        danhMucService.delete(id);
    }

    @PutMapping("/{id}")
    public void update(@Valid @NotNull @PathVariable("id") Integer id,
                       @Valid @RequestBody DanhMucUpdateVO vO) {
        danhMucService.update(id, vO);
    }

    @GetMapping("/{id}")
    public DanhMucDTO getById(@Valid @NotNull @PathVariable("id") Integer id) {
        return danhMucService.getById(id);
    }

    // Sửa lại method query để nhận tham số filter từ query string
    @GetMapping
    public Page<DanhMucDTO> query(
            @RequestParam(required = false) Integer id,
            @RequestParam(required = false) String maDanhMuc,
            @RequestParam(required = false) String tenDanhMuc,
            @RequestParam(required = false) Integer trangThai,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size
    ) {
        DanhMucQueryVO vO = new DanhMucQueryVO();
        vO.setId(id);
        vO.setMaDanhMuc(maDanhMuc);
        vO.setTenDanhMuc(tenDanhMuc);
        vO.setTrangThai(trangThai);
        vO.setPage(page);
        vO.setSize(size);
        return danhMucService.query(vO);
    }

    // Thêm API lấy toàn bộ danh mục cho FE select option động
    @GetMapping("/all")
    public List<DanhMucDTO> getAll() {
        return danhMucService.findAll();
    }
}