package com.example.datn.Controller;

import com.example.datn.DTO.ChiTietSanPhamDTO;
import com.example.datn.Service.ChiTietSanPhamService;
import com.example.datn.VO.ChiTietSanPhamQueryVO;
import com.example.datn.VO.ChiTietSanPhamUpdateVO;
import com.example.datn.VO.ChiTietSanPhamVO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Validated
@RestController
@RequestMapping("/chiTietSanPham")
public class ChiTietSanPhamController {

    @Autowired
    private ChiTietSanPhamService chiTietSanPhamService;

    @PostMapping
    public String save(@Valid @RequestBody ChiTietSanPhamVO vO) {
        return chiTietSanPhamService.save(vO).toString();
    }

    @PostMapping("/batch")
    public List<Integer> saveBatch(@Valid @RequestBody List<ChiTietSanPhamVO> voList) {
        return voList.stream()
                .map(chiTietSanPhamService::save)
                .collect(Collectors.toList());
    }

    @DeleteMapping("/{id}")
    public void delete(@Valid @NotNull @PathVariable("id") Integer id) {
        chiTietSanPhamService.delete(id);
    }

    @PutMapping("/{id}")
    public void update(
            @Valid @NotNull @PathVariable("id") Integer id,
            @ModelAttribute ChiTietSanPhamUpdateVO vO
    ) {
        chiTietSanPhamService.update(id, vO);
    }

    @GetMapping("/{id}")
    public ChiTietSanPhamDTO getById(@Valid @NotNull @PathVariable("id") Integer id) {
        return chiTietSanPhamService.getById(id);
    }

    @GetMapping
    public Page<ChiTietSanPhamDTO> query(@Valid ChiTietSanPhamQueryVO vO) {
        return chiTietSanPhamService.query(vO);
    }

    @GetMapping("/search")
    public List<ChiTietSanPhamDTO> search(@RequestParam("keyword") String keyword) {
        return chiTietSanPhamService.searchByMaOrMoTa(keyword);
    }

    @GetMapping("/by-san-pham/{idSanPham}")
    public List<ChiTietSanPhamDTO> getBySanPham(@PathVariable("idSanPham") Integer idSanPham) {
        return chiTietSanPhamService.findBySanPhamId(idSanPham);
    }

    @GetMapping("/find-by-ma")
    public ChiTietSanPhamDTO getByMaSanPhamChiTiet(@RequestParam("ma") String maSanPhamChiTiet) {
        return chiTietSanPhamService.findByMaSanPhamChiTiet(maSanPhamChiTiet);
    }

    @GetMapping("/all-ma")
    public List<String> getAllMaChiTietSanPham() {
        return chiTietSanPhamService.getAllMaChiTietSanPham();
    }
}