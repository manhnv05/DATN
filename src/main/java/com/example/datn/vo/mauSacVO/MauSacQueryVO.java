package com.example.datn.vo.mauSacVO;

import lombok.Data;
import java.io.Serializable;

@Data
public class MauSacQueryVO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer id;
    private String tenMauSac;
    private String maMau;
    private Integer trangThai;

    // Bổ sung trường phân trang nếu cần
    private Integer page;
    private Integer size;
}