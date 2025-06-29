package com.example.datn.VO;

import lombok.Data;
import java.io.Serializable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

@Data
public class SanPhamVO implements Serializable {
    private static final long serialVersionUID = 1L;

    private String xuatXu;

    @NotNull(message = "Danh mục không được để trống")
    private Integer idDanhMuc;

    @NotBlank(message = "Mã sản phẩm không được để trống")
    @Size(max = 50, message = "Mã sản phẩm không được quá 50 ký tự")
    private String maSanPham;

    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Size(max = 255, message = "Tên sản phẩm không được quá 255 ký tự")
    private String tenSanPham;

    @NotNull(message = "Trạng thái không được để trống")
    @Min(value = 0, message = "Trạng thái không hợp lệ")
    @Max(value = 1, message = "Trạng thái không hợp lệ")
    private Integer trangThai;
}