package com.example.datn.vo.vaiTroVO;


import lombok.Data;

import java.io.Serializable;

@Data
public class VaiTroQueryVO implements Serializable {
    private static final long serialVersionUID = 1L;
    private Integer id;

    private String ten;

    private String moTaVaiTro;

}
