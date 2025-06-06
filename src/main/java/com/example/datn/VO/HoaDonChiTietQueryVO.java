package com.example.datn.VO;


import lombok.Data;

import java.io.Serializable;

@Data
public class HoaDonChiTietQueryVO implements Serializable {
    private static final long serialVersionUID = 1L;
    private Integer id;

    private Integer idHoaDon;

    private Integer idSanPhamChiTiet;

    private Integer gia;

    private Integer soLuong;

    private Integer thanhTien;

    private String ghiChu;

    private Integer trangThai;

}
