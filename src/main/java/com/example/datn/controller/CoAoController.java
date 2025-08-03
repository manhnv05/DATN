package com.example.datn.controller;

import com.example.datn.dto.CoAoDTO;
import com.example.datn.service.CoAoService;
import com.example.datn.vo.coAoVO.CoAoQueryVO;
import com.example.datn.vo.coAoVO.CoAoUpdateVO;
import com.example.datn.vo.coAoVO.CoAoVO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated
@RestController
@RequestMapping("/coAo")
public class CoAoController {

    @Autowired
    private CoAoService coAoService;

    @PostMapping
    public String save(@Valid @RequestBody CoAoVO vO) {
        return coAoService.save(vO).toString();
    }

    @DeleteMapping("/{id}")
    public void delete(@Valid @NotNull @PathVariable("id") Integer id) {
        coAoService.delete(id);
    }

    @PutMapping("/{id}")
    public void update(@Valid @NotNull @PathVariable("id") Integer id,
                       @Valid @RequestBody CoAoUpdateVO vO) {
        coAoService.update(id, vO);
    }

    @GetMapping("/{id}")
    public CoAoDTO getById(@Valid @NotNull @PathVariable("id") Integer id) {
        return coAoService.getById(id);
    }

    // RESTful filter + phân trang + lọc trạng thái
    @GetMapping
    public Page<CoAoDTO> query(
            @RequestParam(required = false) Integer id,
            @RequestParam(required = false) String ma,
            @RequestParam(required = false) String tenCoAo,
            @RequestParam(required = false) Integer trangThai, // <--- Thêm lọc trạng thái
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size
    ) {
        CoAoQueryVO vO = new CoAoQueryVO();
        vO.setId(id);
        vO.setMa(ma);
        vO.setTenCoAo(tenCoAo);
        vO.setTrangThai(trangThai); // <--- Bổ sung
        vO.setPage(page);
        vO.setSize(size);
        return coAoService.query(vO);
    }

    // Lấy toàn bộ cổ áo (dùng cho FE select option động)
    @GetMapping("/all")
    public List<CoAoDTO> getAll() {
        return coAoService.findAll();
    }
}