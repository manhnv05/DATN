package com.example.datn.vo.chiTietPhieuGiamGiaVO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class ChiTietPhieuGiamGiaVO {

    BigDecimal tongTienHoaDon;

    String phieuGiamGia;

    String khachHang;

    String trangThai;
}
