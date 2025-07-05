package com.example.datn.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietPhieuGiamGiaDTO {
    int id;

    PhieuGiamGiaDTO PhieuGiamGia;

    KhachHangDTO KhachHang;

    int trangthai;
}
