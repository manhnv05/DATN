package com.example.datn.VO;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.io.Serializable;
import java.sql.Date;


@Data
public class DotGiamGiaVO {

    private Integer id;

    private String maDotGiamGia;

    @NotBlank(message = "Tên đợt giảm giá không được để trống")
    @Size(max = 100, message = "Tên đợt giảm giá không vượt quá 100 ký tự")
    private String tenDotGiamGia;

    @NotNull(message = "Phần trăm giảm giá là bắt buộc")
    @Min(value = 1, message = "Phần trăm giảm giá phải lớn hơn 0")
    @Max(value = 50, message = "Phần trăm giảm giá phải nhỏ hơn hoặc bằng 50")
    private Integer phanTramGiamGia;

    private Date ngayBatDau;

    private Date ngayKetThuc;

    private Date ngayTao;

    private Date ngaySua;

    private String moTa;

    private Integer trangThai;

}
