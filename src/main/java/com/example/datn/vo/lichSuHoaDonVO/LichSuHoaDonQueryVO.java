package com.example.datn.vo.lichSuHoaDonVO;


import lombok.Data;

import java.io.Serializable;

@Data
public class LichSuHoaDonQueryVO implements Serializable {
    private static final long serialVersionUID = 1L;
    private Integer id;

    private Integer idHoaDon;

    private String maLichSu;

    private String noiDungThayDoi;

    private String nguoiThucHien;

    private String ghiChu;

    private Integer trangThai;

}
