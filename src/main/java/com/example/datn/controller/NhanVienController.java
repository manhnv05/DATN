package com.example.datn.controller;

import com.example.datn.dto.NhanVienDTO;
import com.example.datn.service.NhanVienService;
import com.example.datn.vo.nhanVienVO.NhanVienQueryVO;
import com.example.datn.vo.nhanVienVO.NhanVienUpdateVO;
import com.example.datn.vo.nhanVienVO.NhanVienVO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Validated
@RestController
@RequestMapping("/nhanVien")
public class NhanVienController {

    private final NhanVienService nhanVienService;

    @Autowired
    public NhanVienController(NhanVienService nhanVienService) {
        this.nhanVienService = nhanVienService;
    }

    // Lưu ý: FE phải gửi form-data, field 'vO' là JSON và 'imageFile' là file ảnh
    @PostMapping(consumes = {"multipart/form-data"})
    public String save(
            @RequestPart("vO") @Valid NhanVienVO vO,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile
    ) {
        return nhanVienService.save(vO, imageFile).toString();
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") @NotNull Integer id) {
        nhanVienService.delete(id);
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public void update(
            @PathVariable("id") @NotNull Integer id,
            @RequestPart("vO") @Valid NhanVienUpdateVO vO,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile
    ) {
        nhanVienService.update(id, vO, imageFile);
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