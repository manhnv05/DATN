package com.example.datn.DTO;


import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.sql.Date;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NhanVienDTO {
    Integer id;
    String hinhAnh;
    String maNhanVien;
    String hoVaTen;
    String email;
    String soDienThoai;
    Date ngaySinh;
    String gioiTinh;
    Integer idVaiTro;
    String diaChi;
    Integer trangThai;
    String canCuocCongDan;
}
