package com.example.datn.DTO;


import lombok.Data;

import java.io.Serializable;

@Data
public class HoaDonChiTietDTO {
    private Integer id;

    private Integer idHoaDon;

    private Integer idSanPhamChiTiet;

    private Integer gia;

    private Integer soLuong;

    private Integer thanhTien;

    private String ghiChu;

    private Integer trangThai;

}
