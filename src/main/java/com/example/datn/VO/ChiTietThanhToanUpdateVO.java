package com.example.datn.VO;


import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

@Data
@EqualsAndHashCode(callSuper = false)
public class ChiTietThanhToanUpdateVO extends ChiTietThanhToanVO implements Serializable {
    private static final long serialVersionUID = 1L;

}
