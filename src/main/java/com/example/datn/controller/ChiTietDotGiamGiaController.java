package com.example.datn.controller;

import com.example.datn.dto.ChiTietDotGiamGiaDTO;
import com.example.datn.service.ChiTietDotGiamGiaService;
import com.example.datn.vo.chiTietDotGiamGiaVO.ApplyDotGiamGiaVO;
import com.example.datn.vo.chiTietDotGiamGiaVO.ChiTietDotGiamGiaQueryVO;
import com.example.datn.vo.chiTietDotGiamGiaVO.ChiTietDotGiamGiaUpdateVO;
import com.example.datn.vo.chiTietDotGiamGiaVO.ChiTietDotGiamGiaVO;
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
import java.util.List;

@Validated
@RestController
@RequestMapping("/chiTietDotGiamGia")
public class ChiTietDotGiamGiaController {

    @Autowired
    private ChiTietDotGiamGiaService chiTietDotGiamGiaService;

    @PostMapping
    public String save(@Valid @RequestBody ChiTietDotGiamGiaVO vO) {
        return chiTietDotGiamGiaService.save(vO).toString();
    }

    @DeleteMapping("/{id}")
    public void delete(@Valid @NotNull @PathVariable("id") Integer id) {
        chiTietDotGiamGiaService.delete(id);
    }

    /**
     * Lấy danh sách sản phẩm áp dụng theo đợt giảm giá
     */
    @GetMapping("/by-dot-giam-gia/{idDot}")
    public List<ChiTietDotGiamGiaDTO> getByDotGiamGia(@PathVariable("idDot") Integer idDot) {
        return chiTietDotGiamGiaService.findByDotGiamGia(idDot);
    }

    @PutMapping("/{id}")
    public void update(@Valid @NotNull @PathVariable("id") Integer id,
                       @Valid @RequestBody ChiTietDotGiamGiaUpdateVO vO) {
        chiTietDotGiamGiaService.update(id, vO);
    }

    @GetMapping("/{id}")
    public ChiTietDotGiamGiaDTO getById(@Valid @NotNull @PathVariable("id") Integer id) {
        return chiTietDotGiamGiaService.getById(id);
    }

    @GetMapping
    public Page<ChiTietDotGiamGiaDTO> query(@Valid ChiTietDotGiamGiaQueryVO vO) {
        return chiTietDotGiamGiaService.query(vO);
    }

    /**
     * Áp dụng đợt giảm giá cho danh sách sản phẩm chi tiết
     */
    @PostMapping("/apply")
    public void apply(@Valid @RequestBody ApplyDotGiamGiaVO vO) {
        chiTietDotGiamGiaService.applyDotGiamGia(vO);
    }
}
