package com.example.datn.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CapNhatTrangThaiDTO {
    private Integer idHoaDon;
    private String trangThaiMoi;
    private String tenTrangThaiMoi;
    private String message;
}
