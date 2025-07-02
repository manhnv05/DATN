package com.example.datn.VO;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PhieuGiamGiaVO {

//    private Integer id;

    @NotBlank(message = "Mã phiếu không để trống")
    String maPhieuGiamGia;

    @NotBlank(message = "Điều kiển giảm không để trống")
    String dieuKienGiam;

    @NotBlank(message = "Tên phiếu không để trống")
    String tenPhieu;

    @NotNull
    int loaiPhieu;

    @Min(value = 0, message = "Phần trăm giảm giá phải lớn hơn 0")
    @Max(value = 100, message = "Phần trăm giảm giá phải nhỏ hơn 100")
    BigDecimal phamTramGiamGia;

    BigDecimal soTienGiam;

    @NotNull
    BigDecimal giamToiDa;

    @NotNull(message = "Ngày bắt đầu không được để trống")
    @FutureOrPresent(message = "Ngày bắt đầu phải là hiện tại hoặc tương lai")
    LocalDateTime ngayBatDau;

    @NotNull(message = "Ngày kết thúc không được để trống")
    LocalDateTime ngayKetThuc;

    LocalDateTime ngayTao;

    LocalDateTime ngayCapNhat;

    String ghiChu;

    int trangThai;

    @NotNull(message = "Số lượng không để trống")
    @Min(value = 0, message = "Số lượng phải lớn hơn 0")
    BigDecimal soLuong;

}
