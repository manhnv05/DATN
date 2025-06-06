package com.example.datn.Controller;

import com.example.datn.DTO.ThuongHieuDTO;
import com.example.datn.Service.ThuongHieuService;
import com.example.datn.VO.ThuongHieuQueryVO;
import com.example.datn.VO.ThuongHieuUpdateVO;
import com.example.datn.VO.ThuongHieuVO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequestMapping("/thuongHieu")
public class ThuongHieuController {

    @Autowired
    private ThuongHieuService thuongHieuService;

    @PostMapping
    public String save(@Valid @RequestBody ThuongHieuVO vO) {
        return thuongHieuService.save(vO).toString();
    }

    @DeleteMapping("/{id}")
    public void delete(@Valid @NotNull @PathVariable("id") Integer id) {
        thuongHieuService.delete(id);
    }

    @PutMapping("/{id}")
    public void update(@Valid @NotNull @PathVariable("id") Integer id,
                       @Valid @RequestBody ThuongHieuUpdateVO vO) {
        thuongHieuService.update(id, vO);
    }

    @GetMapping("/{id}")
    public ThuongHieuDTO getById(@Valid @NotNull @PathVariable("id") Integer id) {
        return thuongHieuService.getById(id);
    }

    // Sửa lại để lấy các tham số lọc từ query string thay vì @RequestBody (chuẩn RESTful)
    @GetMapping
    public Page<ThuongHieuDTO> query(
            @RequestParam(required = false) Integer id,
            @RequestParam(required = false) String maThuongHieu,
            @RequestParam(required = false) String tenThuongHieu,
            @RequestParam(required = false) Integer trangThai,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size
    ) {
        ThuongHieuQueryVO vO = new ThuongHieuQueryVO();
        vO.setId(id);
        vO.setMaThuongHieu(maThuongHieu);
        vO.setTenThuongHieu(tenThuongHieu);
        vO.setTrangThai(trangThai);
        vO.setPage(page);
        vO.setSize(size);
        return thuongHieuService.query(vO);
    }
}