package com.example.datn.dto;

import lombok.Data;
import java.io.Serializable;

@Data
public class HinhAnhDTO implements Serializable {
    private Integer id;
    private Integer idSanPhamChiTiet;
    private String maAnh;
    private String duongDanAnh;
    private Integer anhMacDinh;
    private String moTa;
    private Integer trangThai;
}