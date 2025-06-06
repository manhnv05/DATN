package com.example.datn.VO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;


@Data
public class ChiTietSanPhamVO {

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
