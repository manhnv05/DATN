package com.example.datn.VO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;


@Data
public class DiaChiVO {

    private Integer id;

    private Integer idKhachHang;

    private String tinhThanhPho;

    private String quanHuyen;

    private String xaPhuong;

    private Integer trangThai;

}
