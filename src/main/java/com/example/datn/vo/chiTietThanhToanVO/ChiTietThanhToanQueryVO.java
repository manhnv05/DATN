package com.example.datn.vo.chiTietThanhToanVO;


import lombok.Data;

import java.io.Serializable;
import java.sql.Date;

@Data
public class ChiTietThanhToanQueryVO implements Serializable {
    private static final long serialVersionUID = 1L;
    private Integer id;

    private Integer idHoaDon;

    private Integer idHinhThucThanhToan;

    private String maGiaoDich;

    private Integer soTienThanhToan;

    private Date ngayThanhToan;

    private Integer trangThaiThanhToan;

    private String ghiChu;

}
