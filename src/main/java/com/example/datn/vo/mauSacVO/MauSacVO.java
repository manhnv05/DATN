package com.example.datn.vo.mauSacVO;

import lombok.Data;
import java.io.Serializable;

@Data
public class MauSacVO implements Serializable {
    private static final long serialVersionUID = 1L;

    // Không cần id khi thêm mới, id sẽ tự sinh
    private String tenMauSac;
    private String maMau;
    private Integer trangThai;
}