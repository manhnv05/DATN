package com.example.datn.controller;

import com.example.datn.dto.HinhAnhDTO;
import com.example.datn.service.HinhAnhService;
import com.example.datn.vo.hinhAnhVO.HinhAnhQueryVO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Validated
@RestController
@RequestMapping("/hinhAnh")
public class HinhAnhController {

    @Autowired
    private HinhAnhService hinhAnhService;

    @PostMapping
    public ResponseEntity<?> save(
            @RequestParam("ma_anh") String maAnh,
            @RequestParam(value = "duong_dan_anh", required = false) MultipartFile duongDanAnh,
            @RequestParam("anh_mac_dinh") Integer anhMacDinh,
            @RequestParam("mo_ta") String moTa,
            @RequestParam("trang_thai") Integer trangThai,
            @RequestParam(value = "id_san_pham_chi_tiet", required = false) Integer idSanPhamChiTiet
    ) {
        Integer id = hinhAnhService.save(maAnh, anhMacDinh, moTa, trangThai, duongDanAnh, idSanPhamChiTiet);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@Valid @NotNull @PathVariable("id") Integer id) {
        hinhAnhService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @Valid @NotNull @PathVariable("id") Integer id,
            @RequestBody @Valid HinhAnhDTO hinhAnhDTO
    ) {
        hinhAnhService.update(
                id,
                hinhAnhDTO.getMaAnh(),
                hinhAnhDTO.getAnhMacDinh(),
                hinhAnhDTO.getMoTa(),
                hinhAnhDTO.getTrangThai(),
                hinhAnhDTO.getDuongDanAnh(),
                hinhAnhDTO.getIdSanPhamChiTiet()
        );
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HinhAnhDTO> getById(@Valid @NotNull @PathVariable("id") Integer id) {
        return ResponseEntity.ok(hinhAnhService.getById(id));
    }

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

    @GetMapping("/all")
    public List<HinhAnhDTO> getAll() {
        return hinhAnhService.findAll();
    }

    @GetMapping("/by-product-detail/{idSanPhamChiTiet}")
    public List<HinhAnhDTO> getByProductDetail(@PathVariable Integer idSanPhamChiTiet) {
        return hinhAnhService.findByIdSanPhamChiTiet(idSanPhamChiTiet);
    }

    @GetMapping("/find-by-id/{id}")
    public ResponseEntity<HinhAnhDTO> getByIdHinhAnh(@PathVariable("id") Integer id) {
        HinhAnhDTO hinhAnhDTO = hinhAnhService.findByIdHinhAnh(id);
        return ResponseEntity.ok(hinhAnhDTO);
    }

    @PostMapping("/multi")
    public ResponseEntity<?> saveMulti(
            @RequestParam("ma_anh") String maAnh,
            @RequestParam(value = "duong_dan_anh") MultipartFile[] duongDanAnh,
            @RequestParam("anh_mac_dinh") Integer anhMacDinh,
            @RequestParam("mo_ta") String moTa,
            @RequestParam("trang_thai") Integer trangThai,
            @RequestParam(value = "id_san_pham_chi_tiet", required = false) Integer idSanPhamChiTiet
    ) {
        List<Integer> ids = new ArrayList<>();
        for (MultipartFile file : duongDanAnh) {
            Integer id = hinhAnhService.save(maAnh, anhMacDinh, moTa, trangThai, file, idSanPhamChiTiet);
            ids.add(id);
        }
        return ResponseEntity.ok(ids);
    }
}