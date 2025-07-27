package com.example.datn.DTO;

import com.example.datn.DTO.customer.KhachHangDTO;
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
