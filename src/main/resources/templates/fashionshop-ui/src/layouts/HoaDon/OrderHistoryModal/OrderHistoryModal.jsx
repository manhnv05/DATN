import React, { useState, useEffect } from "react";


// Import các component Soft UI và Material-UI
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import Dialog from "@mui/material/Dialog"; // Sử dụng Dialog của Material-UI để tạo modal chuẩn
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper"; // Để bọc bảng
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@mui/material/styles"; // Để truy cập theme nếu cần
import PropTypes from "prop-types";
const OrderHistoryModal = ({ maHoaDon, onClose }) => {
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const theme = useTheme(); // Hook để truy cập theme của Material-UI/Soft UI

    const formatDateTime = (isoString) => {
        if (!isoString) return "";
        try {
            const date = new Date(isoString);
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");

            // Chèn Zero Width Space (\u200B) giữa phần ngày và phần giờ
            return `${day}-${month}-${year}\u200B ${hours}:${minutes}`;
        } catch (e) {
            console.error("Lỗi định dạng ngày giờ:", e);
            return isoString;
        }
    };

    useEffect(() => {
        if (!maHoaDon) {
            setError("Không tìm thấy mã hóa đơn để lấy lịch sử.");
            setLoading(false);
            return;
        }

        const fetchOrderHistory = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`http://localhost:8080/api/hoa-don/lich-su/${maHoaDon}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setHistoryData(data);
            } catch (err) {
                console.error("Lỗi khi lấy lịch sử đơn hàng:", err);
                setError("Không thể tải lịch sử đơn hàng. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderHistory();
    }, [maHoaDon]);

    return (
        <Dialog open={true} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",

                    pr: 1, // Padding right cho nút đóng
                    backgroundColor: theme.palette.background.default, // Hoặc một màu theme khác
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }}
            >
                <SoftTypography variant="h5" color="info" sx={{ flexGrow: 1 }}>
                    Lịch sử đơn hàng: {maHoaDon}
                </SoftTypography>
                <SoftButton iconOnly onClick={onClose} sx={{minWidth: "auto",
                    p: 0.5,fontSize: "1.5rem",}}>
                    &times;
                </SoftButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
                {loading && (
                    <SoftBox display="flex" justifyContent="center" alignItems="center" py={3}>
                        <CircularProgress color="info" size={24} />
                        <SoftTypography variant="body2" ml={2}>
                            Đang tải lịch sử đơn hàng...
                        </SoftTypography>
                    </SoftBox>
                )}
                {error && (
                    <SoftTypography variant="body2" color="error">
                        {error}
                    </SoftTypography>
                )}
                {!loading && !error && historyData.length === 0 && (
                    <SoftTypography variant="body2">Không có lịch sử cho đơn hàng này.</SoftTypography>
                )}
                {!loading && !error && historyData.length > 0 && (
                    <TableContainer
                        component={Paper}
                        sx={{ boxShadow: 0, border: `1px solid ${theme.palette.divider}` }}
                    >
                        <Table>

                            <TableCell sx={{ fontWeight: "bold" }}>Thời gian</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Người chỉnh sửa</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Trạng thái HĐ</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Ghi chú</TableCell>

                            <TableBody>
                                {historyData.map((item, index) => {
                                    console.log(formatDateTime(item.thoiGian)); // THÊM DÒNG NÀY
                                    return (
                                        <TableRow
                                            key={item.id || index}

                                        >
                                            <TableCell>{formatDateTime(item.thoiGian)}</TableCell>

                                            <TableCell sx={{ fontWeight: "bold" }}>{item.nguoiChinhSua}</TableCell>
                                            <TableCell>
                                                <SoftTypography variant="body2" fontWeight="bold">
                                                    {item.trangThaiHoaDon || "N/A"}
                                                </SoftTypography>
                                            </TableCell>
                                            <TableCell sx={{ wordBreak: "break-word" }}>{item.ghiChu || ""}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                <SoftButton
                    variant="outlined"
                    size="medium"
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
                    onClick={onClose}
                >
                    OK
                </SoftButton>
            </DialogActions>
        </Dialog>
    );
};

OrderHistoryModal.propTypes = {
    maHoaDon: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default OrderHistoryModal;