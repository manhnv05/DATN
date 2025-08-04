package com.example.datn.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class HoaDonChiTietDTO {
      Integer id; // ID của bản ghi HoaDonChiTiet
      String maSanPhamChiTiet;
      Integer soLuong;
      Integer gia;
      Integer thanhTien;
      @JsonIgnore
      String ghiChu;
      @JsonIgnore
      Boolean trangThai;
      String tenSanPham;
      String tenMauSac;
      String tenKichThuoc;
      String duongDanAnh;


}
