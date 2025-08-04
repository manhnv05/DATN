package com.example.datn.vo.kichThuocVO;

import lombok.Data;
import java.io.Serializable;

@Data
public class KichThuocVO implements Serializable {
    private static final long serialVersionUID = 1L;

    // Không cần id khi thêm mới, id sẽ tự sinh
    private String ma;
    private String tenKichCo;
    private Integer trangThai;
}