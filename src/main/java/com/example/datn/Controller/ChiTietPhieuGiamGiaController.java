package com.example.datn.Controller;

import com.example.datn.DTO.ChiTietPhieuGiamGiaDTO;
import com.example.datn.Service.ChiTietPhieuGiamGiaService;
import com.example.datn.VO.ChiTietPhieuGiamGiaQueryVO;
import com.example.datn.VO.ChiTietPhieuGiamGiaUpdateVO;
import com.example.datn.VO.ChiTietPhieuGiamGiaVO;
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
@RequestMapping("/chiTietPhieuGiamGia")
public class ChiTietPhieuGiamGiaController {

    @Autowired
    private ChiTietPhieuGiamGiaService chiTietPhieuGiamGiaService;

    @PostMapping
    public String save(@Valid @RequestBody ChiTietPhieuGiamGiaVO vO) {
        return chiTietPhieuGiamGiaService.save(vO).toString();
    }

    @DeleteMapping("/{id}")
    public void delete(@Valid @NotNull @PathVariable("id") Integer id) {
        chiTietPhieuGiamGiaService.delete(id);
    }

    @PutMapping("/{id}")
    public void update(@Valid @NotNull @PathVariable("id") Integer id,
                       @Valid @RequestBody ChiTietPhieuGiamGiaUpdateVO vO) {
        chiTietPhieuGiamGiaService.update(id, vO);
    }

    @GetMapping("/{id}")
    public ChiTietPhieuGiamGiaDTO getById(@Valid @NotNull @PathVariable("id") Integer id) {
        return chiTietPhieuGiamGiaService.getById(id);
    }

    @GetMapping
    public Page<ChiTietPhieuGiamGiaDTO> query(@Valid ChiTietPhieuGiamGiaQueryVO vO) {
        return chiTietPhieuGiamGiaService.query(vO);
    }
}
