package com.example.datn.Controller;

import com.example.datn.DTO.VaiTroDTO;
import com.example.datn.Service.VaiTroService;
import com.example.datn.VO.VaiTroQueryVO;
import com.example.datn.VO.VaiTroUpdateVO;
import com.example.datn.VO.VaiTroVO;
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
@RequestMapping("/vaiTro")
public class VaiTroController {

    @Autowired
    private VaiTroService vaiTroService;

    @PostMapping
    public String save(@Valid @RequestBody VaiTroVO vO) {
        return vaiTroService.save(vO).toString();
    }

    @DeleteMapping("/{id}")
    public void delete(@Valid @NotNull @PathVariable("id") Integer id) {
        vaiTroService.delete(id);
    }

    @PutMapping("/{id}")
    public void update(@Valid @NotNull @PathVariable("id") Integer id,
                       @Valid @RequestBody VaiTroUpdateVO vO) {
        vaiTroService.update(id, vO);
    }

    @GetMapping("/{id}")
    public VaiTroDTO getById(@Valid @NotNull @PathVariable("id") Integer id) {
        return vaiTroService.getById(id);
    }

    @GetMapping
    public Page<VaiTroDTO> query(@Valid VaiTroQueryVO vO) {
        return vaiTroService.query(vO);
    }
}
