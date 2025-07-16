package com.example.datn.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChiTietSanPhamSapHetDTO {
    private String tenSanPham;

    private int soLuong;

    private int giaTien;
}
