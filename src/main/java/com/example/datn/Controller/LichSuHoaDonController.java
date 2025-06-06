package com.example.datn.Controller;

import com.example.datn.DTO.LichSuHoaDonDTO;
import com.example.datn.Service.LichSuHoaDonService;
import com.example.datn.VO.LichSuHoaDonQueryVO;
import com.example.datn.VO.LichSuHoaDonUpdateVO;
import com.example.datn.VO.LichSuHoaDonVO;
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
@RequestMapping("/lichSuHoaDon")
public class LichSuHoaDonController {

    @Autowired
    private LichSuHoaDonService lichSuHoaDonService;

    @PostMapping
    public String save(@Valid @RequestBody LichSuHoaDonVO vO) {
        return lichSuHoaDonService.save(vO).toString();
    }

    @DeleteMapping("/{id}")
    public void delete(@Valid @NotNull @PathVariable("id") Integer id) {
        lichSuHoaDonService.delete(id);
    }

    @PutMapping("/{id}")
    public void update(@Valid @NotNull @PathVariable("id") Integer id,
                       @Valid @RequestBody LichSuHoaDonUpdateVO vO) {
        lichSuHoaDonService.update(id, vO);
    }

    @GetMapping("/{id}")
    public LichSuHoaDonDTO getById(@Valid @NotNull @PathVariable("id") Integer id) {
        return lichSuHoaDonService.getById(id);
    }

    @GetMapping
    public Page<LichSuHoaDonDTO> query(@Valid LichSuHoaDonQueryVO vO) {
        return lichSuHoaDonService.query(vO);
    }
}
