package com.example.datn.vo.chiTietThanhToanVO;


import lombok.Data;

import java.sql.Date;

@Data
public class ChiTietThanhToanVO {

    private Integer id;

    private Integer idHoaDon;

    private Integer idHinhThucThanhToan;

    private String maGiaoDich;

    private Integer soTienThanhToan;

    private Date ngayThanhToan;

    private Integer trangThaiThanhToan;

    private String ghiChu;

}
