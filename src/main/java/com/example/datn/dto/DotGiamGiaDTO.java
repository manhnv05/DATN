package com.example.datn.dto;


import lombok.Data;

import java.sql.Date;

@Data
public class DotGiamGiaDTO {
    private Integer id;

    private String maDotGiamGia;

    private String tenDotGiamGia;

    private Integer phanTramGiamGia;

    private Date ngayBatDau;

    private Date ngayKetThuc;

    private Date ngayTao;

    private Date ngaySua;

    private String moTa;

    private Integer trangThai;

}
