package com.example.datn.VO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;



@Data
public class HoaDonChiTietVO {

    private Integer id;

    private Integer idHoaDon;

    private Integer idSanPhamChiTiet;

    private Integer gia;

    private Integer soLuong;

    private Integer thanhTien;

    private String ghiChu;

    private Integer trangThai;

}
