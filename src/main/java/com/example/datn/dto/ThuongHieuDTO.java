package com.example.datn.dto;

import lombok.Data;
import java.io.Serializable;

@Data
public class ThuongHieuDTO implements Serializable {
    private Integer id;
    private String maThuongHieu;
    private String tenThuongHieu;
    private Integer trangThai;
}