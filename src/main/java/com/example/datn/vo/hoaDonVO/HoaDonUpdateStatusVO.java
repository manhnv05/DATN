package com.example.datn.vo.hoaDonVO;

import com.example.datn.enums.TrangThai;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
@Data
public class HoaDonUpdateStatusVO {

    @NotNull(message = "Trạng thái mới không được trống")
    private TrangThai trangThaiMoi; // Trạng thái mới của hóa đơn
    private String ghiChu;
}
