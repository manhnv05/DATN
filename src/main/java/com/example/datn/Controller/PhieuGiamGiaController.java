package com.example.datn.Controller;

import com.example.datn.DTO.PhieuGiamGiaDTO;
import com.example.datn.Service.PhieuGiamGiaService;
import com.example.datn.VO.PhieuGiamGiaQueryVO;
import com.example.datn.VO.PhieuGiamGiaUpdateVO;
import com.example.datn.VO.PhieuGiamGiaVO;
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
@RequestMapping("/phieuGiamGia")
public class PhieuGiamGiaController {

    @Autowired
    private PhieuGiamGiaService phieuGiamGiaService;

    @PostMapping
    public String save(@Valid @RequestBody PhieuGiamGiaVO vO) {
        return phieuGiamGiaService.save(vO).toString();
    }

    @DeleteMapping("/{id}")
    public void delete(@Valid @NotNull @PathVariable("id") Integer id) {
        phieuGiamGiaService.delete(id);
    }

    @PutMapping("/{id}")
    public void update(@Valid @NotNull @PathVariable("id") Integer id,
                       @Valid @RequestBody PhieuGiamGiaUpdateVO vO) {
        phieuGiamGiaService.update(id, vO);
    }

    @GetMapping("/{id}")
    public PhieuGiamGiaDTO getById(@Valid @NotNull @PathVariable("id") Integer id) {
        return phieuGiamGiaService.getById(id);
    }

    @GetMapping
    public Page<PhieuGiamGiaDTO> query(@Valid PhieuGiamGiaQueryVO vO) {
        return phieuGiamGiaService.query(vO);
    }
}
