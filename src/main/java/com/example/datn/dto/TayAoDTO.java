package com.example.datn.dto;

import lombok.Data;
import java.io.Serializable;

@Data
public class TayAoDTO implements Serializable {
    private Integer id;
    private String ma;
    private String tenTayAo;
    private Integer trangThai;
}