package com.example.datn.vo.chiTietThanhToanVO;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChiTietThanhToanResponseVO {
    private String maGiaoDich;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Timestamp ngayThanhToan;

    private String phuongThucThanhToan;

    private Integer soTienThanhToan;
}
