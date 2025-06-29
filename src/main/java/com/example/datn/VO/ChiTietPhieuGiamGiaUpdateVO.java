package com.example.datn.VO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietPhieuGiamGiaUpdateVO {
    Integer id;

    String phieuGiamGia;

    String khachHang;

    int trangthai;
}
