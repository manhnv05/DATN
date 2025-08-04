package com.example.datn.dto;

import lombok.Data;
import java.io.Serializable;

@Data
public class CoAoDTO implements Serializable {
    private Integer id;
    private String ma;
    private String tenCoAo;
    private Integer trangThai; // Bổ sung trường trạng thái
}