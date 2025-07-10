package com.example.datn.DTO;

import com.example.datn.Entity.ChiTietSanPham;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class ThongKeSPBanChayDTO {
    private String tenSp;

    private int soLuong;

    private int giaTien;

    private String kichCo;
}
