package com.example.datn.VO;

import lombok.Data;

import java.io.Serializable;
import java.sql.Date;
import java.time.LocalDateTime;

@Data
public class DotGiamGiaQueryVO implements Serializable {
    private static final long serialVersionUID = 1L;
    private Integer id;
    private Integer page;
    private Integer size;

    private String maDotGiamGia;

    private String tenDotGiamGia;

    private Integer phanTramGiamGia;

    private LocalDateTime ngayBatDau;

    private LocalDateTime ngayKetThuc;

    private LocalDateTime ngayTao;

    private LocalDateTime ngaySua;

    private String moTa;

    private Integer trangThai;

    public void setTenDotGiamGia(String tenDotGiamGia) {
        this.tenDotGiamGia = tenDotGiamGia;
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }
}
