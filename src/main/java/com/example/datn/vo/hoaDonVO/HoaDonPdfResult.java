package com.example.datn.vo.hoaDonVO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.ByteArrayInputStream;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HoaDonPdfResult {
    private String maHoaDon;
    private ByteArrayInputStream pdfStream;
}