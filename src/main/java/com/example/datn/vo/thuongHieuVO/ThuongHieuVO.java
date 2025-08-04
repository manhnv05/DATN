package com.example.datn.vo.thuongHieuVO;

import lombok.Data;
import java.io.Serializable;

@Data
public class ThuongHieuVO implements Serializable {
    private static final long serialVersionUID = 1L;

    private String maThuongHieu;
    private String tenThuongHieu;
    private Integer trangThai;
}