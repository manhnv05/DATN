package com.example.datn.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TongTienHoaDonDto {
    private String phieuGiamGia;
    private Integer giamGia;
    private Integer tongTien;
    private Integer phiVanChuyen;
    private Integer tongTienHang;
    private  Integer tongHoaDon;
}
