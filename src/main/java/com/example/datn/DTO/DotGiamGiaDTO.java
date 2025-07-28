package com.example.datn.DTO;


import lombok.Data;

import java.io.Serializable;
import java.sql.Date;
import java.time.LocalDateTime;

@Data
public class DotGiamGiaDTO {
    private Integer id;

    private String maDotGiamGia;

    private String tenDotGiamGia;

    private Integer phanTramGiamGia;

    private LocalDateTime ngayBatDau;

    private LocalDateTime ngayKetThuc;

    private LocalDateTime ngayTao;

    private LocalDateTime ngaySua;

    private String moTa;

    private Integer trangThai;

}
