package com.example.datn.enums;

// Không cần import Collections và HashSet nếu không sử dụng Set<TrangThai>
// import java.util.Arrays;
// import java.util.Collections;
// import java.util.HashSet;
// import java.util.Set;

public enum TrangThai {
    //Trạng thái nhân viên/khách hàng.
    ACTIVE("Hoạt động"),
    INACTIVE("Không hoạt động"),
    //Trạng thái địa chỉ nhận hàng.
    DEFAULT("Mặc định"),

    // Chỉ giữ lại tên hiển thị
    TAO_DON_HANG("Tạo đơn hàng"),
    CHO_XAC_NHAN("Chờ xác nhận"),
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
    public boolean canTransitionFrom(TrangThai oldStatus) {
        // Đây là nơi bạn định nghĩa các quy tắc chuyển đổi hợp lệ
        switch (this) {
            case CHO_XAC_NHAN:
                return oldStatus == TAO_DON_HANG;
            case CHO_GIAO_HANG:
                return oldStatus == CHO_XAC_NHAN;
            case DANG_VAN_CHUYEN:
                return oldStatus == CHO_GIAO_HANG;
            case HOAN_THANH:
                return oldStatus == DANG_VAN_CHUYEN;
            case HUY:
                // Hủy có thể từ nhiều trạng thái, nhưng không từ HOAN_THANH
                return oldStatus != HOAN_THANH && oldStatus != HUY;
            // Thêm các trường hợp khác nếu cần
            default:
                return false; // Mặc định không cho phép chuyển đổi nếu không định nghĩa
        }
    }

    public boolean canRevertTo(TrangThai newStatus) {
        switch (this) {
            case TAO_DON_HANG:
                return false; // Không thể quay lại từ trạng thái đầu tiên
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