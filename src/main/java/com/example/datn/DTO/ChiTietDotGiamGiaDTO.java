package com.example.datn.DTO;


import lombok.Data;

import java.io.Serializable;
import java.sql.Date;

@Data
public class ChiTietDotGiamGiaDTO {
    private Integer id;

    private Integer idDotGiamGia;

    private Integer idSanPhamChiTiet;

    private Integer giaTruocKhiGiam;

    private Integer giaSauKhiGiam;

    private String ghiChu;

    private Date ngayTao;

    private Integer trangThai;

}
