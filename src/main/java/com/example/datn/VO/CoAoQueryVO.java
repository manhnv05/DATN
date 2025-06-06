package com.example.datn.VO;

import lombok.Data;
import java.io.Serializable;

@Data
public class CoAoQueryVO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer id;
    private String ma;
    private String tenCoAo;

    // Bổ sung trường phân trang nếu cần cho query động
    private Integer page;
    private Integer size;
}