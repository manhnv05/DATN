package com.example.datn.VO;


import lombok.Data;

import java.io.Serializable;
import java.sql.Date;

@Data
public class PhieuGiamGiaQueryVO implements Serializable {
    private static final long serialVersionUID = 1L;
    private Integer id;

    private String maPhieuGiamGia;

    private String dieuKienGiam;

    private String tenPhieu;

    private String loaiPhieu;

    private Integer phamTramGiamGia;

    private Integer soTienGiam;

    private Integer giamToiDa;

    private Date ngayBatDau;

    private Date ngayKetThuc;

    private Date ngayTao;

    private Date ngayCapNhat;

    private String ghiChu;

    private Integer trangThai;

}
