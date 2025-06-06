package com.example.datn.VO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;
import java.sql.Date;


@Data
public class DotGiamGiaVO {

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
