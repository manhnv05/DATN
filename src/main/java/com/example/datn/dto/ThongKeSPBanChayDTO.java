package com.example.datn.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
