package com.example.datn.VO;


import lombok.Data;

import java.io.Serializable;
import java.sql.Date;

@Data
public class HinhThucThanhToanQueryVO implements Serializable {
    private static final long serialVersionUID = 1L;
    private Integer id;

    private String maHinhThuc;

    private String phuongThucThanhToan;

    private String moTa;

    private Date ngayTao;

    private Date ngayCapNhat;

    private Integer trangThai;

}
