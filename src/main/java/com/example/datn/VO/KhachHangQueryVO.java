package com.example.datn.VO;


import lombok.Data;

import java.io.Serializable;
import java.sql.Date;

@Data
public class KhachHangQueryVO implements Serializable {
    private static final long serialVersionUID = 1L;
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

    private Integer page;
    private Integer size;

}
