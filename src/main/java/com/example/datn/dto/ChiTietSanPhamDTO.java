package com.example.datn.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class ChiTietSanPhamDTO implements Serializable {
    private Integer id;

    private Integer idSanPham;
    private String tenSanPham;

    private Integer idChatLieu;
    private String tenChatLieu;

    private Integer idThuongHieu;
    private String tenThuongHieu;

    private Integer idMauSac;
    private String tenMauSac;

    private Integer idKichThuoc;
    private String tenKichThuoc;

    private Integer idCoAo;
    private String tenCoAo;

    private Integer idTayAo;
    private String tenTayAo;

    private String maSanPhamChiTiet;

    private Integer gia;

    private Integer soLuong;

    private Integer trongLuong;

    private String moTa;

    private Integer trangThai;
}