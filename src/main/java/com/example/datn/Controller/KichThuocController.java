package com.example.datn.Controller;

import com.example.datn.DTO.KichThuocDTO;
import com.example.datn.Service.KichThuocService;
import com.example.datn.VO.KichThuocQueryVO;
import com.example.datn.VO.KichThuocUpdateVO;
import com.example.datn.VO.KichThuocVO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequestMapping("/kichThuoc")
public class KichThuocController {

    @Autowired
    private KichThuocService kichThuocService;

    @PostMapping
    public String save(@Valid @RequestBody KichThuocVO vO) {
        return kichThuocService.save(vO).toString();
    }

    @DeleteMapping("/{id}")
    public void delete(@Valid @NotNull @PathVariable("id") Integer id) {
        kichThuocService.delete(id);
    }

    @PutMapping("/{id}")
    public void update(@Valid @NotNull @PathVariable("id") Integer id,
                       @Valid @RequestBody KichThuocUpdateVO vO) {
        kichThuocService.update(id, vO);
    }

    @GetMapping("/{id}")
    public KichThuocDTO getById(@Valid @NotNull @PathVariable("id") Integer id) {
        return kichThuocService.getById(id);
    }

    // Sửa lại method query để nhận tham số filter từ query string (chuẩn RESTful)
    @GetMapping
    public Page<KichThuocDTO> query(
            @RequestParam(required = false) Integer id,
            @RequestParam(required = false) String ma,
            @RequestParam(required = false) String tenKichCo,
            @RequestParam(required = false) Integer trangThai,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size
    ) {
        KichThuocQueryVO vO = new KichThuocQueryVO();
        vO.setId(id);
        vO.setMa(ma);
        vO.setTenKichCo(tenKichCo);
        vO.setTrangThai(trangThai);
        vO.setPage(page);
        vO.setSize(size);
        return kichThuocService.query(vO);
    }
}