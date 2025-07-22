package com.example.datn.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class LichSuThanhToanDTO {
    private Integer soTienThanhToan;
    private String maGiaoDich;
   private LocalDateTime  thoiGianThanhToan;
   private String ghiChu;
   private String nhanVienXacNhan;
   private String tenHinhThucThanhToan;

}
