package com.example.datn.vo.danhMucVO;

import lombok.Data;
import java.io.Serializable;

@Data
public class DanhMucVO implements Serializable {
    private static final long serialVersionUID = 1L;

    // Không cần id vì VO dùng cho thêm mới, id tự sinh
    private String maDanhMuc;
    private String tenDanhMuc;
    private Integer trangThai;
}