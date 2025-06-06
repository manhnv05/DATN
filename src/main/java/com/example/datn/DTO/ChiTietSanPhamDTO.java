package com.example.datn.DTO;


import lombok.Data;

import java.io.Serializable;

@Data
public class ChiTietSanPhamDTO {
    private Integer id;

    private Integer idSanPham;

    private Integer idMauSac;

    private Integer idKichThuoc;

    private Integer idCoAo;

    private Integer idTayAo;

    private String maSanPhamChiTiet;

    private Integer gia;

    private Integer soLuong;

    private Integer trongLuong;

    private String moTa;

    private Integer trangThai;

}
