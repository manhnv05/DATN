package com.example.datn.VO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;
import java.sql.Date;


@Data
public class NhanVienVO {

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

    private String tenTaiKhoan;

    private String matKhau;

    private String chucVu;

    private Integer trangThai;

}
