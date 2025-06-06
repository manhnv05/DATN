package com.example.datn.Controller;

import com.example.datn.DTO.CoAoDTO;
import com.example.datn.Service.CoAoService;
import com.example.datn.VO.CoAoQueryVO;
import com.example.datn.VO.CoAoUpdateVO;
import com.example.datn.VO.CoAoVO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequestMapping("/coAo")
public class CoAoController {

    @Autowired
    private CoAoService coAoService;

    @PostMapping
    public String save(@Valid @RequestBody CoAoVO vO) {
        return coAoService.save(vO).toString();
    }

    @DeleteMapping("/{id}")
    public void delete(@Valid @NotNull @PathVariable("id") Integer id) {
        coAoService.delete(id);
    }

    @PutMapping("/{id}")
    public void update(@Valid @NotNull @PathVariable("id") Integer id,
                       @Valid @RequestBody CoAoUpdateVO vO) {
        coAoService.update(id, vO);
    }

    @GetMapping("/{id}")
    public CoAoDTO getById(@Valid @NotNull @PathVariable("id") Integer id) {
        return coAoService.getById(id);
    }

    // Chuẩn RESTful: filter qua @RequestParam, phân trang
    @GetMapping
    public Page<CoAoDTO> query(
            @RequestParam(required = false) Integer id,
            @RequestParam(required = false) String ma,
            @RequestParam(required = false) String tenCoAo,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size
    ) {
        CoAoQueryVO vO = new CoAoQueryVO();
        vO.setId(id);
        vO.setMa(ma);
        vO.setTenCoAo(tenCoAo);
        vO.setPage(page);
        vO.setSize(size);
        return coAoService.query(vO);
    }
}