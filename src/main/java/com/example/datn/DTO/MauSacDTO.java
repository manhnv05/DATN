package com.example.datn.DTO;

import lombok.Data;
import java.io.Serializable;

@Data
public class MauSacDTO implements Serializable {
    private Integer id;
    private String tenMauSac;
    private String maMau;
    private Integer trangThai;
}