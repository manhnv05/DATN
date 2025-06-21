package com.example.datn.Controller;

import com.example.datn.DTO.DotGiamGiaDTO;
import com.example.datn.Service.DotGiamGiaService;
import com.example.datn.VO.DotGiamGiaQueryVO;
import com.example.datn.VO.DotGiamGiaUpdateVO;
import com.example.datn.VO.DotGiamGiaVO;
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
@RequestMapping("/dotGiamGia")
public class DotGiamGiaController {

    @Autowired
    private DotGiamGiaService dotGiamGiaService;

    @PostMapping
    public String save(@Valid @RequestBody DotGiamGiaVO vO) {
        return dotGiamGiaService.save(vO).toString();
    }

    @DeleteMapping("/{id}")
    public void delete(@Valid @NotNull @PathVariable("id") Integer id) {
        dotGiamGiaService.delete(id);
    }

    @PutMapping("/{id}")
    public void update(@Valid @NotNull @PathVariable("id") Integer id,
                       @Valid @RequestBody DotGiamGiaUpdateVO vO) {
        dotGiamGiaService.update(id, vO);
    }

    @GetMapping("/{id}")
    public DotGiamGiaDTO getById(@Valid @NotNull @PathVariable("id") Integer id) {
        return dotGiamGiaService.getById(id);
    }

    @GetMapping
    public Page<DotGiamGiaDTO> query(@Valid DotGiamGiaQueryVO vO) {
        return dotGiamGiaService.query(vO);
    }
}
