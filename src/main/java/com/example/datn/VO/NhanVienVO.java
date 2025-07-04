package com.example.datn.VO;

import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.sql.Date;


@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NhanVienVO {
    String hinhAnh;
    String hoVaTen;
    String soDienThoai;
    String email;
    String canCuocCongDan;
    Date ngaySinh;
    String gioiTinh;
    Integer idVaiTro;
    String diaChi;
}
