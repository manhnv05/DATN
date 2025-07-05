package com.example.datn.DTO;


import lombok.Data;

import java.io.Serializable;
import java.sql.Date;

@Data
public class KhachHangDTO {
    private Integer id;

    private String maKhachHang;

    private String matKhau;

    private String tenKhachHang;

    private String email;

    private Integer gioiTinh;

    private String sdt;

    private Date ngaySinh;

    private String hinhAnh;

    private Integer trangThai;

}
