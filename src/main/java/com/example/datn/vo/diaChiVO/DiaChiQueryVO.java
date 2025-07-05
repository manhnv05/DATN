package com.example.datn.vo.diaChiVO;


import lombok.Data;

import java.io.Serializable;

@Data
public class DiaChiQueryVO implements Serializable {
    private static final long serialVersionUID = 1L;
    private Integer id;

    private Integer idKhachHang;

    private String tinhThanhPho;

    private String quanHuyen;

    private String xaPhuong;

    private Integer trangThai;

}
