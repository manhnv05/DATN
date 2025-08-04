package com.example.datn.vo.lichSuHoaDonVO;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;



@Data
public class LichSuHoaDonVO {

    private Integer id;

    private Integer idHoaDon;

    private String maLichSu;

    private String noiDungThayDoi;

    private String nguoiThucHien;

    private String ghiChu;

    private Integer trangThai;

}
