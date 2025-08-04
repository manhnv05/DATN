package com.example.datn.vo.phieuGiamGiaVO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class PhieuGiamVOSearch {
    String maPhieuGiamGia;

    String tenPhieu;

    Integer trangThai;

    LocalDateTime ngayBatDau;

    LocalDateTime ngayKetThuc;

}
