package com.example.datn.vo.chiTietSanPhamVO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.io.Serializable;

@Data
public class ChiTietSanPhamVO implements Serializable {
    private static final long serialVersionUID = 1L;

    @NotNull(message = "Sản phẩm không được để trống")
    private Integer idSanPham;

    @NotNull(message = "Chất liệu không được để trống")
    private Integer idChatLieu;

    @NotNull(message = "Thương hiệu không được để trống")
    private Integer idThuongHieu;

    @NotNull(message = "Màu sắc không được để trống")
    private Integer idMauSac;

    @NotNull(message = "Kích thước không được để trống")
    private Integer idKichThuoc;

    @NotNull(message = "Cổ áo không được để trống")
    private Integer idCoAo;

    @NotNull(message = "Tay áo không được để trống")
    private Integer idTayAo;

    @NotBlank(message = "Mã sản phẩm chi tiết không được để trống")
    private String maSanPhamChiTiet;

    @NotNull(message = "Giá không được để trống")
    @Positive(message = "Giá phải lớn hơn 0")
    private Integer gia;

    @NotNull(message = "Số lượng không được để trống")
    @PositiveOrZero(message = "Số lượng phải lớn hơn hoặc bằng 0")
    private Integer soLuong;

    @NotNull(message = "Trọng lượng không được để trống")
    @Positive(message = "Trọng lượng phải lớn hơn 0")
    private Integer trongLuong;

    private String moTa;

    @NotNull(message = "Trạng thái không được để trống")
    private Integer trangThai;
}