package com.example.datn.VO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietPhieuGiamGiaVO {

    BigDecimal tongTienHoaDon;

    String phieuGiamGia;

    String khachHang;

    String trangThai;
}
