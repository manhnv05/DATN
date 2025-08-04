package com.example.datn.vo.danhMucVO;

import lombok.Data;
import java.io.Serializable;

@Data
public class DanhMucQueryVO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer id;
    private String maDanhMuc;
    private String tenDanhMuc;
    private Integer trangThai;

    // Thêm các trường phân trang nếu cần thiết cho truy vấn
    private Integer page;
    private Integer size;
}