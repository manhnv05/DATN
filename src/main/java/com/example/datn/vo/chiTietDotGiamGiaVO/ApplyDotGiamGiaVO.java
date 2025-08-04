package com.example.datn.vo.chiTietDotGiamGiaVO;

import lombok.Data;

import java.util.List;

/**
 * VO dùng cho API áp dụng đợt giảm giá cho danh sách sản phẩm chi tiết
 */
@Data
public class ApplyDotGiamGiaVO {
    private Integer idDotGiamGia;
    private List<Integer> idSanPhamChiTietList;
}