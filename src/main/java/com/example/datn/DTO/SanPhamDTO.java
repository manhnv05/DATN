package com.example.datn.DTO;


import lombok.Data;

import java.io.Serializable;

@Data
public class SanPhamDTO {
    private Integer id;

    private Integer idChatLieu;

    private Integer idThuongHieu;

    private Integer idXuatXu;

    private Integer idDanhMuc;

    private String maSanPham;

    private String tenSanPham;

    private Integer trangThai;

}
