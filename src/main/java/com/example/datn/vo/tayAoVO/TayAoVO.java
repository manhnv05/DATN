package com.example.datn.vo.tayAoVO;

import lombok.Data;
import java.io.Serializable;

@Data
public class TayAoVO implements Serializable {
    private static final long serialVersionUID = 1L;

    // Không cần id khi thêm mới, id sẽ tự sinh
    private String ma;
    private String tenTayAo;
    private Integer trangThai;
}