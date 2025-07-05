package com.example.datn.vo.hinhThucThanhToanVO;

import lombok.Data;

import java.sql.Date;


@Data
public class HinhThucThanhToanVO {

    private Integer id;

    private String maHinhThuc;

    private String phuongThucThanhToan;

    private String moTa;

    private Date ngayTao;

    private Date ngayCapNhat;

    private Integer trangThai;

}
