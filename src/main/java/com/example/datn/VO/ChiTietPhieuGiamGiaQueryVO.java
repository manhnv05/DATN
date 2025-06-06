package com.example.datn.VO;


import lombok.Data;

import java.io.Serializable;

@Data
public class ChiTietPhieuGiamGiaQueryVO implements Serializable {
    private static final long serialVersionUID = 1L;
    private Integer id;

    private Integer idKhachHang;

    private Integer idPhieuGiamGia;

    private Integer soLanDuocDung;

    private Integer trangThai;

}
