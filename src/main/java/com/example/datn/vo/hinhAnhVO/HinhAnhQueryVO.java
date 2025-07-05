package com.example.datn.vo.hinhAnhVO;

import lombok.Data;
import java.io.Serializable;

@Data
public class HinhAnhQueryVO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer id;
    private Integer idSanPhamChiTiet;
    private String maAnh;
    private String duongDanAnh;
    private Integer anhMacDinh;
    private String moTa;
    private Integer trangThai;

    // Thêm trường phân trang nếu muốn hỗ trợ query động
    private Integer page;
    private Integer size;
}