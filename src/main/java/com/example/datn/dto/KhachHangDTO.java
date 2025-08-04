package com.example.datn.dto;

import lombok.Data;
import java.sql.Date;
import java.util.List;

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

    // Thêm dòng này để chứa danh sách địa chỉ
    private List<DiaChiDTO> diaChis;
}