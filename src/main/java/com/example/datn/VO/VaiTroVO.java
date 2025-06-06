package com.example.datn.VO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;



@Data
public class VaiTroVO {

    private Integer id;

    private String ten;

    private String moTaVaiTro;

}
