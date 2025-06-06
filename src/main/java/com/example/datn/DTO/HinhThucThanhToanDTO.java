package com.example.datn.DTO;


import lombok.Data;

import java.io.Serializable;
import java.sql.Date;

@Data
public class HinhThucThanhToanDTO {
    private Integer id;

    private String maHinhThuc;

    private String phuongThucThanhToan;

    private String moTa;

    private Date ngayTao;

    private Date ngayCapNhat;

    private Integer trangThai;

}
