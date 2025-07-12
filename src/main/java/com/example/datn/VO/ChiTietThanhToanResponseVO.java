package com.example.datn.VO;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChiTietThanhToanResponseVO {
    private String maGiaoDich;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date ngayThanhToan;

    private String phuongThucThanhToan;

    private Integer soTienThanhToan;
}
