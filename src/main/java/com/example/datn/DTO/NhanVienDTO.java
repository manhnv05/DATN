package com.example.datn.DTO;


import lombok.Data;

import java.io.Serializable;
import java.sql.Date;

@Data
public class NhanVienDTO{
    private Integer id;

    private Integer idVaiTro;

    private String maNhanVien;

    private String hoVaTen;

    private String hinhAnh;

    private String gioiTinh;

    private Date ngaySinh;

    private String soDienThoai;

    private String canCuocCongDan;

    private String email;

    private String diaChi;

    private String matKhau;

    private Integer trangThai;

}
