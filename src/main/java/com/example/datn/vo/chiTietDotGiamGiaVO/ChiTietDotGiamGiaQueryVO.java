package com.example.datn.vo.chiTietDotGiamGiaVO;


import lombok.Data;

import java.io.Serializable;
import java.sql.Date;

@Data
public class ChiTietDotGiamGiaQueryVO implements Serializable {
    private static final long serialVersionUID = 1L;
    private Integer id;

    private Integer idDotGiamGia;

    private Integer idSanPhamChiTiet;

    private Integer giaTruocKhiGiam;

    private Integer giaSauKhiGiam;

    private String ghiChu;

    private Date ngayTao;

    private Integer trangThai;

}