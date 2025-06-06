package com.example.datn.VO;


import lombok.Data;

import java.io.Serializable;
import java.sql.Date;

@Data
public class DotGiamGiaQueryVO implements Serializable {
    private static final long serialVersionUID = 1L;
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
