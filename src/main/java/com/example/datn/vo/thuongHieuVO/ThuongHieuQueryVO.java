package com.example.datn.vo.thuongHieuVO;

import lombok.Data;
import java.io.Serializable;

@Data
public class ThuongHieuQueryVO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer id;
    private String maThuongHieu;
    private String tenThuongHieu;
    private Integer trangThai;

    // Thêm các trường phân trang nếu dùng:
    private Integer page;
    private Integer size;
}