package com.example.datn.Controller;

import com.example.datn.DTO.DiaChiDTO;
import com.example.datn.Service.DiaChiService;
import com.example.datn.VO.DiaChiQueryVO;
import com.example.datn.VO.DiaChiUpdateVO;
import com.example.datn.VO.DiaChiVO;
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
@RequestMapping("/diaChi")
public class DiaChiController {

    @Autowired
    private DiaChiService diaChiService;

    @PostMapping
    public String save(@Valid @RequestBody DiaChiVO vO) {
        return diaChiService.save(vO).toString();
    }

    @DeleteMapping("/{id}")
    public void delete(@Valid @NotNull @PathVariable("id") Integer id) {
        diaChiService.delete(id);
    }

    @PutMapping("/{id}")
    public void update(@Valid @NotNull @PathVariable("id") Integer id,
                       @Valid @RequestBody DiaChiUpdateVO vO) {
        diaChiService.update(id, vO);
    }

    @GetMapping("/{id}")
    public DiaChiDTO getById(@Valid @NotNull @PathVariable("id") Integer id) {
        return diaChiService.getById(id);
    }

    @GetMapping
    public Page<DiaChiDTO> query(@Valid DiaChiQueryVO vO) {
        return diaChiService.query(vO);
    }
}
