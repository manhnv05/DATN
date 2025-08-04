import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// --- BƯỚC 1: IMPORT CÁC COMPONENT GIAO DIỆN CHUẨN ---
import Grid from "@mui/material/Grid";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Card from "@mui/material/Card";
import InputAdornment from "@mui/material/InputAdornment";
import Icon from "@mui/material/Icon";
import QRCodeScanner from "../../BanHangTaiQuay/QRCodeScanner/QRCodeScanner";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { toast } from "react-toastify";

// Helper function để lấy ngày hiện tại dưới định dạng YYYY-MM-DD
const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

// --- BƯỚC 2: THAY ĐỔI LOGIC ĐỂ NHẬN PROPS TỪ COMPONENT CHA ---
function OrderFilter({ onFilterChange, filterValues, onClearFilters }) {
    // Lấy ngày hôm nay dưới dạng chuỗi YYYY-MM-DD
    const todayString = getTodayDateString();

    // Sử dụng state cục bộ cho các input
    // CÁCH KHỞI TẠO ĐỂ HIỂN THỊ NGÀY HIỆN TẠI NGAY KHI VÀO TRANG
    const [localFilters, setLocalFilters] = useState(() => {
        // Hàm khởi tạo này chỉ chạy MỘT LẦN khi component được mount
        return {
            searchTerm: filterValues.searchTerm || "",
            ngayTaoStart: filterValues.ngayTaoStart || todayString, // Sử dụng todayString làm mặc định
            ngayTaoEnd: filterValues.ngayTaoEnd || todayString, // Sử dụng todayString làm mặc định
            loaiHoaDon: filterValues.loaiHoaDon || "",
        };
    });

    // useEffect này để đồng bộ localFilters với filterValues từ cha
    // Nó sẽ chạy khi filterValues từ cha thay đổi (ví dụ: khi cha reset filters)
    useEffect(() => {
        setLocalFilters({
            searchTerm: filterValues.searchTerm || "",
            ngayTaoStart: filterValues.ngayTaoStart || todayString, // Quan trọng: Đảm bảo đồng bộ với ngày hôm nay nếu filterValues rỗng
            ngayTaoEnd: filterValues.ngayTaoEnd || todayString, // Quan trọng: Đảm bảo đồng bộ với ngày hôm nay nếu filterValues rỗng
            loaiHoaDon: filterValues.loaiHoaDon || "",
        });
    }, [filterValues]); // Dependency array chỉ cần filterValues

    // Hàm xử lý khi người dùng thay đổi giá trị trong các ô input
    const handleInputChange = (field, value) => {
        setLocalFilters((prev) => ({ ...prev, [field]: value }));
    };

    // Khi bấm nút "Tìm kiếm", gửi toàn bộ state nội bộ lên component cha
    const handleApply = () => {
        onFilterChange(localFilters);
    };
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const handleScanSuccess = (decodedText) => {
        // 1. Cập nhật giá trị cho ô tìm kiếm
        handleInputChange("searchTerm", decodedText);

        // 2. Tự động đóng modal scanner
        setIsScannerOpen(false);

        toast.success(`Đã quét mã: ${decodedText}`);
    };
    const handleScanError = (errorMessage) => {
        if (
            errorMessage.includes("NotFoundException") ||
            errorMessage.includes("The source width is 0")
        ) {
            return; // Không làm gì cả với các lỗi này
        }

        toast.error("Không thể quét mã QR.");
    };
    // Hàm xử lý khi bấm nút "Xóa lọc"
    // HÀM NÀY SẼ GỌI onClearFilters TỪ CHA
    // VÀ SAU ĐÓ useEffect TRÊN SẼ CẬP NHẬT localFilters VỀ MẶC ĐỊNH (NGÀY HÔM NAY)
    const handleClearFiltersInternal = () => {
        // Bạn có thể gọi onClearFilters từ prop hoặc tự định nghĩa reset ở đây
        // Nếu onClearFilters của cha reset filterValues về rỗng/null, useEffect sẽ tự động set ngày hôm nay
        // Nếu onClearFilters của cha không làm gì, bạn có thể tự reset localFilters ở đây
        // Ví dụ:
        onClearFilters(); // Gọi hàm xóa lọc từ component cha

        // Hoặc tự reset localFilters nếu bạn muốn nó luôn hiển thị ngày hôm nay
        // setLocalFilters({
        //     searchTerm: '',
        //     ngayTaoStart: todayString,
        //     ngayTaoEnd: todayString,
        //     loaiHoaDon: '',
        // });
    };

    return (
        <Card>
            <SoftBox p={3}>
                <Grid container spacing={3} alignItems="flex-end">
                    {/* Ô Tìm kiếm */}
                    <Grid item xs={12} sm={6} md={3}>
                        <SoftTypography component="label" variant="caption" fontWeight="bold">
                            Tìm kiếm
                        </SoftTypography>
                        <SoftInput
                            type="text"
                            placeholder="Mã HĐ, Tên KH, SĐT..."
                            value={localFilters.searchTerm}
                            onChange={(e) => handleInputChange("searchTerm", e.target.value)}
                        />
                    </Grid>

                    {/* Ô Từ ngày */}
                    <Grid item xs={12} sm={6} md={2}>
                        <SoftTypography component="label" variant="caption" fontWeight="bold">
                            Từ ngày
                        </SoftTypography>
                        <SoftInput
                            type="date"
                            value={localFilters.ngayTaoStart} // Đảm bảo dùng localFilters
                            onChange={(e) => handleInputChange("ngayTaoStart", e.target.value)}
                        />
                    </Grid>

                    {/* Ô Đến ngày */}
                    <Grid item xs={12} sm={6} md={2}>
                        <SoftTypography component="label" variant="caption" fontWeight="bold">
                            Đến ngày
                        </SoftTypography>
                        <SoftInput
                            type="date"
                            value={localFilters.ngayTaoEnd} // Đảm bảo dùng localFilters
                            onChange={(e) => handleInputChange("ngayTaoEnd", e.target.value)}
                        />
                    </Grid>

                    {/* Ô Loại */}
                    <Grid item xs={12} sm={6} md={2}>
                        <SoftTypography component="label" variant="caption" fontWeight="bold">
                            Loại
                        </SoftTypography>
                        <Select
                            fullWidth
                            value={localFilters.loaiHoaDon}
                            onChange={(e) => handleInputChange("loaiHoaDon", e.target.value)}
                            sx={{ height: "45px", borderRadius: "0.5rem" }}
                            displayEmpty // <<<<< THÊM THUỘC TÍNH NÀY
                            renderValue={(selected) => {
                                // <<<<< THÊM THUỘC TÍNH NÀY
                                if (selected === "") {
                                    return "Tất cả"; // Hiển thị "Tất cả" khi giá trị là rỗng
                                }

                                if (selected === "online") {
                                    return "Trực tuyến";
                                }
                                if (selected === "Tại quầy") {
                                    return "Tại quầy";
                                }
                                return selected; // Trả về giá trị nếu không khớp (hoặc giá trị không mong đợi)
                            }}
                        >
                            <MenuItem value="">Tất cả</MenuItem>
                            <MenuItem value="online">Trực tuyến</MenuItem>
                            <MenuItem value="Tại quầy">Tại quầy</MenuItem>
                        </Select>
                    </Grid>

                    {/* Nút Tìm kiếm và Xóa lọc */}
                    <Grid item xs={12} md={3} sx={{ display: "flex", gap: "10px" }}>
                        <SoftButton
                            variant="outlined"
                            size="small"
                            sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 400,
                                color: "#49a3f1",
                                borderColor: "#49a3f1",
                                boxShadow: "none",
                                "&:hover": {
                                    borderColor: "#1769aa",
                                    background: "#f0f6fd",
                                    color: "#1769aa",
                                },
                            }}
                            fullWidth
                            onClick={handleApply}
                        >
                            Tìm kiếm
                        </SoftButton>
                        <SoftButton
                            variant="outlined"

                            sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 400,
                                color: "#49a3f1",
                                borderColor: "#49a3f1",
                                boxShadow: "none",
                                "&:hover": {
                                    borderColor: "#1769aa",
                                    background: "#f0f6fd",
                                    color: "#1769aa",
                                },
                            }}
                            onClick={() => setIsScannerOpen(true)} // Mở modal khi bấm
                        >
                            <QrCodeScannerIcon />
                        </SoftButton>
                        <SoftButton
                            variant="outlined"
                            color="secondary"
                            sx={{
                                borderRadius: 2,
                                textTransform: "none",
                            }}
                            fullWidth
                            onClick={handleClearFiltersInternal}
                        >
                            Xóa lọc
                        </SoftButton>
                    </Grid>
                </Grid>
            </SoftBox>
            <QRCodeScanner
                open={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
                onScanSuccess={handleScanSuccess}
                onScanError={handleScanError}
            />
        </Card>

    );
}

// PropTypes validation
OrderFilter.propTypes = {
    onFilterChange: PropTypes.func.isRequired,
    filterValues: PropTypes.shape({
        searchTerm: PropTypes.string,
        ngayTaoStart: PropTypes.string, // Kiểu chuỗi cho định dạng ngày (YYYY-MM-DD)
        ngayTaoEnd: PropTypes.string, // Kiểu chuỗi cho định dạng ngày (YYYY-MM-DD)
        loaiHoaDon: PropTypes.string,
    }).isRequired,
    onClearFilters: PropTypes.func.isRequired,
};

export default OrderFilter;