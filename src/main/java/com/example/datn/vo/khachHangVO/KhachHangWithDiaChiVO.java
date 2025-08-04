package com.example.datn.vo.khachHangVO;

import com.example.datn.vo.diaChiVO.DiaChiVO;
import lombok.Data;

@Data
public class KhachHangWithDiaChiVO {
    private KhachHangVO khachHang;
    private DiaChiVO diaChi;
}
