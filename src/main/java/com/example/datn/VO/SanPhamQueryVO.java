package com.example.datn.VO;

import lombok.Data;
import java.io.Serializable;

@Data
public class SanPhamQueryVO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer id;
    private Integer idChatLieu;
    private Integer idThuongHieu;
    private String xuatXu;
    private Integer idDanhMuc;
    private String maSanPham;
    private String tenSanPham;
    private Integer trangThai;

    private Integer page;
    private Integer size;
}