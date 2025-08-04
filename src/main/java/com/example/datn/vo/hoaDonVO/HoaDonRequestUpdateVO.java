package com.example.datn.vo.hoaDonVO;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class HoaDonRequestUpdateVO {

    private Integer idHoaDon;
    private String khachHang;           // ID của khách hàng
    private String nhanVien;            // ID của nhân viên
    private String phieuGiamGia;        // ID của phiếu giảm giá
    private String tenKhachHang;
    private String sdt;
    private String diaChi;
    private String ghiChu;
    private Integer phiVanChuyen;       // Nên có để tính tổng hóa đơn cuối cùng

    // Danh sách các sản phẩm cần cập nhật trong hóa đơn
    private List<SanPhamCapNhatVO> danhSachSanPham;



    /**
     * Class nội dùng để hứng dữ liệu cho mỗi sản phẩm được cập nhật.
     */
    @Data
    public static class SanPhamCapNhatVO {
        private Integer id;
        private Integer soLuong;
        private Integer donGia;
        private Integer idDotGiamGia;
    }


}