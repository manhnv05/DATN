package com.example.datn.DTO;

import com.example.datn.enums.TrangThai;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class HoaDonHistoryDTO {
    private Timestamp thoiGian; // Thời gian thay đổi
    private String nguoiChinhSua;  // Người thực hiện thay đổi
    private String trangThaiHoaDon; // Trạng thái mới của hóa đơn (tên hiển thị từ Enum)
    private String ghiChu;

}
