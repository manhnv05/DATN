package com.example.datn.dto;


import lombok.Data;

import java.io.Serializable;
import java.sql.Date;

@Data
public class ChiTietThanhToanDTO {
    private Integer id;

    private Integer idHoaDon;

    private Integer idHinhThucThanhToan;

    private String maGiaoDich;

    private Integer soTienThanhToan;

    private Date ngayThanhToan;

    private Integer trangThaiThanhToan;

    private String ghiChu;

}
