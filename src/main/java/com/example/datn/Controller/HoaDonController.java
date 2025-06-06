package com.example.datn.Controller;

import com.example.datn.DTO.HoaDonDTO;
import com.example.datn.Service.HoaDonService;
import com.example.datn.VO.HoaDonQueryVO;
import com.example.datn.VO.HoaDonUpdateVO;
import com.example.datn.VO.HoaDonVO;
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
@RequestMapping("/hoaDon")
public class HoaDonController {

    @Autowired
    private HoaDonService hoaDonService;

    @PostMapping
    public String save(@Valid @RequestBody HoaDonVO vO) {
        return hoaDonService.save(vO).toString();
    }

    @DeleteMapping("/{id}")
    public void delete(@Valid @NotNull @PathVariable("id") Integer id) {
        hoaDonService.delete(id);
    }

    @PutMapping("/{id}")
    public void update(@Valid @NotNull @PathVariable("id") Integer id,
                       @Valid @RequestBody HoaDonUpdateVO vO) {
        hoaDonService.update(id, vO);
    }

    @GetMapping("/{id}")
    public HoaDonDTO getById(@Valid @NotNull @PathVariable("id") Integer id) {
        return hoaDonService.getById(id);
    }

    @GetMapping
    public Page<HoaDonDTO> query(@Valid HoaDonQueryVO vO) {
        return hoaDonService.query(vO);
    }
}
