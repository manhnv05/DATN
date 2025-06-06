package com.example.datn.DTO;

import lombok.Data;
import java.io.Serializable;

@Data
public class TayAoDTO implements Serializable {
    private Integer id;
    private String ma;
    private String tenTayAo;
    private Integer trangThai;
}