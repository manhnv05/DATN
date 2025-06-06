package com.example.datn.VO;


import lombok.Data;

import java.io.Serializable;

@Data
public class XuatXuQueryVO implements Serializable {
    private static final long serialVersionUID = 1L;
    private Integer id;

    private String tenXuatXu;

}
