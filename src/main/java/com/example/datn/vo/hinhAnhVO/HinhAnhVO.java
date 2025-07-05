package com.example.datn.vo.hinhAnhVO;

import lombok.Data;
import java.io.Serializable;

@Data
public class HinhAnhVO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer idSanPhamChiTiet;
    private String maAnh;
    private String duongDanAnh;
    private Integer anhMacDinh;
    private String moTa;
    private Integer trangThai;
}