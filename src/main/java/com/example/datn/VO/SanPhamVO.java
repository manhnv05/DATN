package com.example.datn.VO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;


@Data
public class SanPhamVO {

    private Integer id;

    private Integer idChatLieu;

    private Integer idThuongHieu;

    private Integer idXuatXu;

    private Integer idDanhMuc;

    private String maSanPham;

    private String tenSanPham;

    private Integer trangThai;

}
