package com.example.datn.Controller;

import com.example.datn.DTO.NhanVienDTO;
import com.example.datn.Service.NhanVienService;
import com.example.datn.VO.NhanVienQueryVO;
import com.example.datn.VO.NhanVienUpdateVO;
import com.example.datn.VO.NhanVienVO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequestMapping("/nhanVien")
public class NhanVienController {

    private final NhanVienService nhanVienService;

    @Autowired
    public NhanVienController(NhanVienService nhanVienService) {
        this.nhanVienService = nhanVienService;
    }

    @PostMapping
    public String save(@Valid @RequestBody NhanVienVO vO) {
        return nhanVienService.save(vO).toString();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") @NotNull Integer id) {
        nhanVienService.delete(id);
    }

    @PutMapping("/{id}")
    public void update(@PathVariable("id") @NotNull Integer id,
                       @Valid @RequestBody NhanVienUpdateVO vO) {
        nhanVienService.update(id, vO);
    }

    @GetMapping("/{id}")
    public NhanVienDTO getById(@PathVariable("id") @NotNull Integer id) {
        return nhanVienService.getById(id);
    }

    @GetMapping
    public Page<NhanVienDTO> query(@Valid NhanVienQueryVO vO) {
        return nhanVienService.query(vO);
    }
}