package com.example.datn.dto;

import java.time.LocalDateTime;

public interface LichSuThanhToanProjection {
    Integer getSoTienThanhToan();
    String getMaGiaoDich();
    LocalDateTime getThoiGianThanhToan();
    String getGhiChu();
    String getNhanVienXacNhan();
    String getTenHinhThucThanhToan();
}
