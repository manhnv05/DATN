package com.example.datn.VO;

import lombok.Data;
import java.io.Serializable;

@Data
public class CoAoVO implements Serializable {
    private static final long serialVersionUID = 1L;

    // Không cần id khi thêm mới (id tự sinh)
    private String ma;
    private String tenCoAo;
}