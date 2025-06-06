package com.example.datn.Controller;

import com.example.datn.DTO.MauSacDTO;
import com.example.datn.Service.MauSacService;
import com.example.datn.VO.MauSacQueryVO;
import com.example.datn.VO.MauSacUpdateVO;
import com.example.datn.VO.MauSacVO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequestMapping("/mauSac")
public class MauSacController {

    @Autowired
    private MauSacService mauSacService;

    @PostMapping
    public String save(@Valid @RequestBody MauSacVO vO) {
        return mauSacService.save(vO).toString();
    }

    @DeleteMapping("/{id}")
    public void delete(@Valid @NotNull @PathVariable("id") Integer id) {
        mauSacService.delete(id);
    }

    @PutMapping("/{id}")
    public void update(@Valid @NotNull @PathVariable("id") Integer id,
                       @Valid @RequestBody MauSacUpdateVO vO) {
        mauSacService.update(id, vO);
    }

    @GetMapping("/{id}")
    public MauSacDTO getById(@Valid @NotNull @PathVariable("id") Integer id) {
        return mauSacService.getById(id);
    }

    // Sửa hàm query để nhận filter từ query string (chuẩn RESTful)
    @GetMapping
    public Page<MauSacDTO> query(
            @RequestParam(required = false) Integer id,
            @RequestParam(required = false) String tenMauSac,
            @RequestParam(required = false) String maMau,
            @RequestParam(required = false) Integer trangThai,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size
    ) {
        MauSacQueryVO vO = new MauSacQueryVO();
        vO.setId(id);
        vO.setTenMauSac(tenMauSac);
        vO.setMaMau(maMau);
        vO.setTrangThai(trangThai);
        vO.setPage(page);
        vO.setSize(size);
        return mauSacService.query(vO);
    }
}