package com.example.datn.DTO;


import lombok.Data;

import java.io.Serializable;

@Data
public class DiaChiDTO {
    private Integer id;

    private Integer idKhachHang;

    private String tinhThanhPho;

    private String quanHuyen;

    private String xaPhuong;

    private Integer trangThai;


}
