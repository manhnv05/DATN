package com.example.datn.DTO;


import lombok.Data;

import java.io.Serializable;

@Data
public class LichSuHoaDonDTO{
    private Integer id;

    private Integer idHoaDon;

    private String maLichSu;

    private String noiDungThayDoi;

    private String nguoiThucHien;

    private String ghiChu;

    private Integer trangThai;

}
