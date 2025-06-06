package com.example.datn.Controller;

import com.example.datn.DTO.KhachHangDTO;
import com.example.datn.Service.KhachHangService;
import com.example.datn.VO.KhachHangQueryVO;
import com.example.datn.VO.KhachHangUpdateVO;
import com.example.datn.VO.KhachHangVO;
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
@RequestMapping("/khachHang")
public class KhachHangController {

    @Autowired
    private KhachHangService khachHangService;

    @PostMapping
    public String save(@Valid @RequestBody KhachHangVO vO) {
        return khachHangService.save(vO).toString();
    }

    @DeleteMapping("/{id}")
    public void delete(@Valid @NotNull @PathVariable("id") Integer id) {
        khachHangService.delete(id);
    }

    @PutMapping("/{id}")
    public void update(@Valid @NotNull @PathVariable("id") Integer id,
                       @Valid @RequestBody KhachHangUpdateVO vO) {
        khachHangService.update(id, vO);
    }

    @GetMapping("/{id}")
    public KhachHangDTO getById(@Valid @NotNull @PathVariable("id") Integer id) {
        return khachHangService.getById(id);
    }

    @GetMapping
    public Page<KhachHangDTO> query(@Valid KhachHangQueryVO vO) {
        return khachHangService.query(vO);
    }
}
