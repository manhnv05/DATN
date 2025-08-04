package com.example.datn.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class ThongKeDTO {
    private BigDecimal tongTienTatCa;

    private int tongSanPham;

    private int tongDonHuy;

    private int tongDonHoanThanh;
}
