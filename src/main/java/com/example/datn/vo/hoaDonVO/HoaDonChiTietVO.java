package com.example.datn.vo.hoaDonVO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HoaDonChiTietVO {
    @NotNull(message = "ID sản phẩm chi tiết không được trống") // Validation: không được null
    private Integer id; // ID của ChiTietSanPham
    @Min(value = 1, message = "Số lượng phải lớn hơn 0") // Validation: số lượng tối thiểu là 1
    private Integer soLuong;
}
