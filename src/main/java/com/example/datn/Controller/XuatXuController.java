package com.example.datn.Controller;

import com.example.datn.DTO.XuatXuDTO;
import com.example.datn.Service.XuatXuService;
import com.example.datn.VO.XuatXuQueryVO;
import com.example.datn.VO.XuatXuUpdateVO;
import com.example.datn.VO.XuatXuVO;
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
@RequestMapping("/xuatXu")
public class XuatXuController {

    @Autowired
    private XuatXuService xuatXuService;

    @PostMapping
    public String save(@Valid @RequestBody XuatXuVO vO) {
        return xuatXuService.save(vO).toString();
    }

    @DeleteMapping("/{id}")
    public void delete(@Valid @NotNull @PathVariable("id") Integer id) {
        xuatXuService.delete(id);
    }

    @PutMapping("/{id}")
    public void update(@Valid @NotNull @PathVariable("id") Integer id,
                       @Valid @RequestBody XuatXuUpdateVO vO) {
        xuatXuService.update(id, vO);
    }

    @GetMapping("/{id}")
    public XuatXuDTO getById(@Valid @NotNull @PathVariable("id") Integer id) {
        return xuatXuService.getById(id);
    }

    @GetMapping
    public Page<XuatXuDTO> query(@Valid XuatXuQueryVO vO) {
        return xuatXuService.query(vO);
    }
}
