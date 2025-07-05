package com.example.datn.dto;

import lombok.Data;
import java.io.Serializable;

@Data
public class DanhMucDTO implements Serializable {
    private Integer id;
    private String maDanhMuc;
    private String tenDanhMuc;
    private Integer trangThai;
}