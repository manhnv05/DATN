package com.example.datn.vo.chiTietThanhToanVO;


import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;
import java.sql.Date;

@Data
public class ChiTietThanhToanVO {

    private Integer id;

    private Integer idHoaDon;

    private Integer idHinhThucThanhToan;

    private String maGiaoDich;

    private Integer soTienThanhToan;

    private Integer trangThaiThanhToan;

    private String ghiChu;

}
