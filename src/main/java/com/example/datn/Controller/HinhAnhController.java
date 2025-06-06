package com.example.datn.Controller;

import com.example.datn.DTO.HinhAnhDTO;
import com.example.datn.Service.HinhAnhService;
import com.example.datn.VO.HinhAnhQueryVO;
import com.example.datn.VO.HinhAnhUpdateVO;
import com.example.datn.VO.HinhAnhVO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequestMapping("/hinhAnh")
public class HinhAnhController {

    @Autowired
    private HinhAnhService hinhAnhService;

    @PostMapping
    public String save(@Valid @RequestBody HinhAnhVO vO) {
        return hinhAnhService.save(vO).toString();
    }

    @DeleteMapping("/{id}")
    public void delete(@Valid @NotNull @PathVariable("id") Integer id) {
        hinhAnhService.delete(id);
    }

    @PutMapping("/{id}")
    public void update(@Valid @NotNull @PathVariable("id") Integer id,
                       @Valid @RequestBody HinhAnhUpdateVO vO) {
        hinhAnhService.update(id, vO);
    }

    @GetMapping("/{id}")
    public HinhAnhDTO getById(@Valid @NotNull @PathVariable("id") Integer id) {
        return hinhAnhService.getById(id);
    }

    // Chuẩn RESTful: filter qua @RequestParam, hỗ trợ phân trang động
    @GetMapping
    public Page<HinhAnhDTO> query(
            @RequestParam(required = false) Integer id,
            @RequestParam(required = false) Integer idSanPhamChiTiet,
            @RequestParam(required = false) String maAnh,
            @RequestParam(required = false) String duongDanAnh,
            @RequestParam(required = false) Integer anhMacDinh,
            @RequestParam(required = false) String moTa,
            @RequestParam(required = false) Integer trangThai,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size
    ) {
        HinhAnhQueryVO vO = new HinhAnhQueryVO();
        vO.setId(id);
        vO.setIdSanPhamChiTiet(idSanPhamChiTiet);
        vO.setMaAnh(maAnh);
        vO.setDuongDanAnh(duongDanAnh);
        vO.setAnhMacDinh(anhMacDinh);
        vO.setMoTa(moTa);
        vO.setTrangThai(trangThai);
        vO.setPage(page);
        vO.setSize(size);
        return hinhAnhService.query(vO);
    }
}