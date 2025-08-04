package com.example.datn.controller;

import com.example.datn.dto.VaiTroDTO;
import com.example.datn.service.VaiTroService;
import com.example.datn.vo.vaiTroVO.VaiTroQueryVO;
import com.example.datn.vo.vaiTroVO.VaiTroUpdateVO;
import com.example.datn.vo.vaiTroVO.VaiTroVO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated
@RestController
@RequestMapping("/vaiTro")
public class VaiTroController {

    private final VaiTroService vaiTroService;

    public VaiTroController(VaiTroService vaiTroService) {
        this.vaiTroService = vaiTroService;
    }

    @PostMapping
    public String save(@Valid @RequestBody VaiTroVO vaiTroVO) {
        return vaiTroService.save(vaiTroVO).toString();
    }

    @PostMapping("/add")
    public VaiTroDTO addRole(@Valid @RequestBody VaiTroVO vaiTroVO) {
        return vaiTroService.addRole(vaiTroVO);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") @NotNull Integer id) {
        vaiTroService.delete(id);
    }

    @PutMapping("/{id}")
    public void update(@PathVariable("id") @NotNull Integer id,
                       @Valid @RequestBody VaiTroUpdateVO vaiTroUpdateVO) {
        vaiTroService.update(id, vaiTroUpdateVO);
    }

    @GetMapping("/{id}")
    public VaiTroDTO getById(@PathVariable("id") @NotNull Integer id) {
        return vaiTroService.getById(id);
    }

    @GetMapping
    public Page<VaiTroDTO> query(
            @Valid VaiTroQueryVO vaiTroQueryVO,
            Pageable pageable
    ) {
        return vaiTroService.query(vaiTroQueryVO, pageable);
    }

    @GetMapping("/list")
    public List<VaiTroDTO> getAllVaiTro() {
        return vaiTroService.getAllVaiTro();
    }
}