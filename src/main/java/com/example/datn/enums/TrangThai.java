package com.example.datn.enums;

// Không cần import Collections và HashSet nếu không sử dụng Set<TrangThai>
// import java.util.Arrays;
// import java.util.Collections;
// import java.util.HashSet;
// import java.util.Set;

public enum TrangThai {
    // Chỉ giữ lại tên hiển thị
    TAO_DON_HANG("Tạo đơn hàng"),
    CHO_XAC_NHAN("Chờ xác nhận"),
    DA_XAC_NHAN("Đã xác nhận"),
    CHO_GIAO_HANG("Chờ giao hàng"),
    DANG_VAN_CHUYEN("Đang vận chuyển"),
    //    DA_GIAO("Đã giao hàng"),
//    CHO_THANH_TOAN("Chờ thanh toán"),
//    DA_THANH_TOAN("Đã thanh toán"),
    HOAN_THANH("Hoàn thành"),
    HUY("Hủy");

    private final String displayName; // Trường để lưu tên hiển thị

    // Constructor của enum
    TrangThai(String displayName) {
        this.displayName = displayName;
    }

    // Phương thức getter cho displayName
    public String getDisplayName() {
        return displayName;
    }

    // Phương thức kiểm tra chuyển đổi trạng thái hợp lệ
    // Bỏ qua logic ràng buộc, luôn cho phép chuyển đổi
    public boolean canTransitionTo(TrangThai newState) {
        // 'this' là trạng thái cũ
        switch (newState) {
            case HOAN_THANH:
                // Chỉ cho phép hoàn thành khi đang vận chuyển hoặc đã xác nhận (tại quầy)
                return this == DANG_VAN_CHUYEN || this == DA_XAC_NHAN;
            case HUY:
                // Cho phép hủy khi chưa hoàn thành hoặc chưa bị hủy
                return this != HOAN_THANH && this != HUY;
            // ... định nghĩa tất cả các quy tắc hợp lệ khác
            default:
                return false;
        }
    }

    public boolean canRevertTo(TrangThai newStatus) {
        switch (this) {
            case TAO_DON_HANG:
                return false;
            case CHO_XAC_NHAN:

                return newStatus == TAO_DON_HANG;
            case CHO_GIAO_HANG:

                return newStatus == CHO_XAC_NHAN;
            case DANG_VAN_CHUYEN:

                return newStatus == CHO_GIAO_HANG;
            case HOAN_THANH:

                return false;
            case HUY:

                return false;

            default:
                return false;
        }
    }
}