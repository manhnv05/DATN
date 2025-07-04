package com.example.datn.VO;


import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;
import java.sql.Date;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NhanVienQueryVO  {
     Integer idVaiTro;
     String maNhanVien;
     String hoVaTen;
     String gioiTinh;
     String soDienThoai;
     Integer trangThai;
     Integer page;
     Integer size;
}
