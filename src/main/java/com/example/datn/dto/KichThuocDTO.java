package com.example.datn.dto;

import lombok.Data;
import java.io.Serializable;

@Data
public class KichThuocDTO implements Serializable {
    private Integer id;
    private String ma;
    private String tenKichCo;
    private Integer trangThai;
}