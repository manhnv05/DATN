package com.example.datn.vo.kichThuocVO;

import lombok.Data;
import java.io.Serializable;

@Data
public class KichThuocQueryVO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer id;
    private String ma;
    private String tenKichCo;
    private Integer trangThai;

    // Bổ sung phân trang nếu cần
    private Integer page;
    private Integer size;
}