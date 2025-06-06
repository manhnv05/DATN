package com.example.datn.VO;


import lombok.Data;

import java.io.Serializable;

@Data
public class ChiTietSanPhamQueryVO implements Serializable {
    private static final long serialVersionUID = 1L;
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
