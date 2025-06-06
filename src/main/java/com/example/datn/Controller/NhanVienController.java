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
@RequestMapping("/nhanVien")
public class NhanVienController {

    @Autowired
    private NhanVienService nhanVienService;

    @PostMapping
    public String save(@Valid @RequestBody NhanVienVO vO) {
        return nhanVienService.save(vO).toString();
    }

    @DeleteMapping("/{id}")
    public void delete(@Valid @NotNull @PathVariable("id") Integer id) {
        nhanVienService.delete(id);
    }

    @PutMapping("/{id}")
    public void update(@Valid @NotNull @PathVariable("id") Integer id,
                       @Valid @RequestBody NhanVienUpdateVO vO) {
        nhanVienService.update(id, vO);
    }

    @GetMapping("/{id}")
    public NhanVienDTO getById(@Valid @NotNull @PathVariable("id") Integer id) {
        return nhanVienService.getById(id);
    }

    @GetMapping
    public Page<NhanVienDTO> query(@Valid NhanVienQueryVO vO) {
        return nhanVienService.query(vO);
    }
}
