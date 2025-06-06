package com.example.datn.VO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;
import java.sql.Date;



@Data
public class KhachHangVO {

    private Integer id;

    private String maKhachHang;

    private String tenTaiKhoan;

    private String matKhau;

    private String tenKhachHang;

    private String email;

    private Integer gioiTinh;

    private String sdt;

    private Date ngaySinh;

    private String ghiChu;

    private String hinhAnh;

    private Integer trangThai;

}
