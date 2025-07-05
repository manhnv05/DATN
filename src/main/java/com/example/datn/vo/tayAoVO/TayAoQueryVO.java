package com.example.datn.vo.tayAoVO;

import lombok.Data;
import java.io.Serializable;

@Data
public class TayAoQueryVO implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer id;
    private String ma;
    private String tenTayAo;
    private Integer trangThai;

    // Bổ sung trường phân trang nếu cần cho query động
    private Integer page;
    private Integer size;
}