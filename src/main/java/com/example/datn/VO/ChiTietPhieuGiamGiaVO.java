package com.example.datn.VO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;



@Data
public class ChiTietPhieuGiamGiaVO {

    private Integer id;

    private Integer idKhachHang;

    private Integer idPhieuGiamGia;

    private Integer soLanDuocDung;

    private Integer trangThai;

}
