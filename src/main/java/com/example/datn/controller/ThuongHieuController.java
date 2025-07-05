package com.example.datn.controller;

import com.example.datn.dto.ThuongHieuDTO;
import com.example.datn.service.ThuongHieuService;
import com.example.datn.vo.thuongHieuVO.ThuongHieuQueryVO;
import com.example.datn.vo.thuongHieuVO.ThuongHieuUpdateVO;
import com.example.datn.vo.thuongHieuVO.ThuongHieuVO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated
@RestController
@RequestMapping("/thuongHieu")
public class ThuongHieuController {

    @Autowired
    private ThuongHieuService thuongHieuService;

    @PostMapping
    public String save(@Valid @RequestBody ThuongHieuVO vO) {
        return thuongHieuService.save(vO).toString();
    }

    @DeleteMapping("/{id}")
    public void delete(@Valid @NotNull @PathVariable("id") Integer id) {
        thuongHieuService.delete(id);
    }

    @PutMapping("/{id}")
    public void update(@Valid @NotNull @PathVariable("id") Integer id,
                       @Valid @RequestBody ThuongHieuUpdateVO vO) {
        thuongHieuService.update(id, vO);
    }

    @GetMapping("/{id}")
    public ThuongHieuDTO getById(@Valid @NotNull @PathVariable("id") Integer id) {
        return thuongHieuService.getById(id);
    }

    // Chuẩn RESTful: lấy các tham số lọc từ query string
    @GetMapping
    public Page<ThuongHieuDTO> query(
            @RequestParam(required = false) Integer id,
            @RequestParam(required = false) String maThuongHieu,
            @RequestParam(required = false) String tenThuongHieu,
            @RequestParam(required = false) Integer trangThai,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size
    ) {
        ThuongHieuQueryVO vO = new ThuongHieuQueryVO();
        vO.setId(id);
        vO.setMaThuongHieu(maThuongHieu);
        vO.setTenThuongHieu(tenThuongHieu);
        vO.setTrangThai(trangThai);
        vO.setPage(page);
        vO.setSize(size);
        return thuongHieuService.query(vO);
    }

    // Lấy tất cả thương hiệu (dùng cho FE select option)
    @GetMapping("/all")
    public List<ThuongHieuDTO> getAll() {
        return thuongHieuService.findAll();
    }
}