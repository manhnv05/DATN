package com.example.datn.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class ChiTietSanPhamDotGIamGIaDTO {
    private Integer idChiTietSanPham;
    private String duongDanAnh;
    private String tenSanPham;
    private String maSanPham;
    private String thuongHieu;
    private Integer soLuongTonKho;
    private String danhMuc;
    private String chatLieu;
    private String mauSac;
    private String kichThuoc;
    private String coAo;
    private String tayAo;
    private Integer giaTienSauKhiGiam;
    private Integer gia;
    private Integer phanTramGiam;
    private Integer  idDotGiamGia;
}
