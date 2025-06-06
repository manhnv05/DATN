package com.example.datn.DTO;


import lombok.Data;

import java.io.Serializable;
import java.sql.Date;

@Data
public class HoaDonDTO {
    private Integer id;

    private Integer idNhanVien;

    private Integer idKhachHang;

    private Integer idPhieuGiamGia;

    private String maHoaDon;

    private Date ngayTao;

    private Integer tongTien;

    private Integer giamGia;

    private Integer tongTienBanDau;

    private Integer phiVanChuyen;

    private Integer tongTienHoaDon;

    private String tenKhachHang;

    private Date ngayDat;

    private Date ngayGiaoDuKien;

    private String sdt;

    private String diaChi;

    private String ghiChu;

    private Integer trangThai;

}
