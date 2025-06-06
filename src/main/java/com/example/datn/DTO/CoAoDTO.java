package com.example.datn.DTO;

import lombok.Data;
import java.io.Serializable;

@Data
public class CoAoDTO implements Serializable {
    private Integer id;
    private String ma;
    private String tenCoAo;
}