import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SoftButton from "components/SoftButton";

// Hàm tiện ích định dạng tiền tệ
const formatCurrency = (amount) => {
  if (typeof amount !== "number" || isNaN(amount)) return "0 VND";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
};

function PaymentModal({ open, onClose, totalAmount, onConfirm, hoaDonId }) {

  // State cho dữ liệu thanh toán cũ từ API
  const [previousPayments, setPreviousPayments] = useState([]);
  // State cho dữ liệu thanh toán mới được thêm trong UI
  const [newPayments, setNewPayments] = useState([]);

  // State cho form nhập liệu
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [amount, setAmount] = useState("");
  const [transactionCode, setTransactionCode] = useState("");
  const [transactionCodeError, setTransactionCodeError] = useState("");

  // Tự động gọi API để lấy lịch sử thanh toán khi modal được mở
  useEffect(() => {
    const fetchPreviousPayments = async () => {
      if (!hoaDonId) {
        setPreviousPayments([]);
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:8080/chiTietThanhToan/${hoaDonId}/chi-tiet-thanh-toan`
        );
        setPreviousPayments(response.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử thanh toán:", error);
        setPreviousPayments([]); 
      }
    };

    if (open) {
      fetchPreviousPayments();
    }
  }, [open, hoaDonId]);

  // Gộp 2 danh sách thanh toán để hiển thị và tính toán
  const allPayments = useMemo(
    () => [...previousPayments, ...newPayments],
    [previousPayments, newPayments]
  );

  const totalPaid = useMemo(() => {
    return allPayments.reduce((sum, p) => sum + (p.soTienThanhToan || 0), 0);
  }, [allPayments]);

  // Tính số tiền còn thiếu
  const amountOwed = totalAmount - totalPaid;

  // Xử lý khi thêm một lần thanh toán mới
  const handleAddPayment = () => {
    const paymentAmount = Number(amount);
    if (!paymentAmount || paymentAmount <= 0) {
      alert("Vui lòng nhập số tiền hợp lệ.");
      return;
    }

    if (paymentMethod === "transfer" && !transactionCode.trim()) {
      // Set nội dung lỗi thay vì alert
      setTransactionCodeError("Vui lòng nhập mã giao dịch.");
      return; // Dừng lại
    }

    // Nếu không có lỗi, đảm bảo clear thông báo lỗi cũ (nếu có)
    setTransactionCodeError("");

    // Tạo object thanh toán mới với key nhất quán với API
    const newPayment = {
      idHinhThucThanhToan: paymentMethod === "cash" ? 1 : 2,
      idHoaDon: hoaDonId,
      maGiaoDich: paymentMethod === "transfer" ? transactionCode : null,
      soTienThanhToan: paymentAmount,
      trangThaiThanhToan: 1,
    };
    setNewPayments([...newPayments, newPayment]);
    setAmount("");
    setTransactionCode("");
  };

  // Xử lý khi xác nhận thanh toán
  const handleConfirm = () => {
    if (amountOwed > 0) {
      alert(`Còn thiếu ${formatCurrency(amountOwed)}. Vui lòng thanh toán đủ.`);
      return;
    }
    // Chỉ gửi về cho component cha những thanh toán MỚI
    onConfirm(newPayments); 
    handleClose();
  };

  // Xử lý khi đóng modal
  const handleClose = () => {
    // Dọn dẹp tất cả state để chuẩn bị cho lần mở tiếp theo
    setPreviousPayments([]);
    setNewPayments([]);
    setAmount("");
    setTransactionCode("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="bold">
            THANH TOÁN (Hóa đơn #{hoaDonId})
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {/* Phần hiển thị tổng tiền */}
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h6">Tổng tiền hàng</Typography>
          <Typography variant="h6" color="primary.main" fontWeight="bold">
            {formatCurrency(totalAmount)}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Typography variant="h6">Tiền thiếu</Typography>
          <Typography variant="h6" color="error.main" fontWeight="bold">
            {formatCurrency(amountOwed > 0 ? amountOwed : 0)}
          </Typography>
        </Box>

        {/* Phần form nhập liệu */}
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Box display="flex" gap={2} mb={2}>
            <Button
              variant={paymentMethod === "transfer" ? "contained" : "outlined"}
              color="secondary"
              onClick={() => setPaymentMethod("transfer")}
            >
              Chuyển khoản
            </Button>
            <Button
              variant={paymentMethod === "cash" ? "contained" : "outlined"}
              color="success"
              onClick={() => setPaymentMethod("cash")}
            >
              Tiền mặt
            </Button>
          </Box>
          <Box display="flex" gap={2} alignItems="flex-start">
            <TextField
              label="Tiền khách đưa"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              sx={{ flexGrow: 1 }}
              autoFocus
            />
            {paymentMethod === "transfer" && (
              <TextField
                label="Mã giao dịch"
                value={transactionCode}
                onChange={(e) => {
                  setTransactionCode(e.target.value);
                  // Xóa lỗi ngay khi người dùng nhập
                  if (transactionCodeError) {
                    setTransactionCodeError("");
                  }
                }}
                sx={{ flexGrow: 1 }}
                // THÊM 2 PROPS NÀY ĐỂ HIỂN THỊ LỖI
                error={!!transactionCodeError} // `!!` chuyển chuỗi lỗi thành boolean (true/false)
                helperText={transactionCodeError} // Hiển    thị nội dung lỗi bên dưới
              />
            )}
            <SoftButton
              variant="gradient"
              color="info"
              onClick={handleAddPayment}
              sx={{ height: "56px" }}
            >
              Thêm
            </SoftButton>
          </Box>
        </Paper>

        {/* Phần bảng hiển thị chi tiết thanh toán */}
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead sx={{ display: "table-header-group", backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Mã giao dịch</TableCell>
                <TableCell>Phương thức</TableCell>
                <TableCell align="right">Số tiền</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Chưa có thanh toán nào
                  </TableCell>
                </TableRow>
              ) : (
                allPayments.map((p, index) => (
                  <TableRow
                    key={index}
                    sx={{ backgroundColor: newPayments.includes(p) ? "#e8f5e9" : "inherit" }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{p.maGiaoDich || "---"}</TableCell>
                    <TableCell>
                      {p.idHinhThucThanhToan === 1 ? "Tiền mặt" : "Chuyển khoản"}
                    </TableCell>
                    <TableCell align="right">{formatCurrency(p.soTienThanhToan)}</TableCell>
                  </TableRow>
                ))
              )}
              {/* Hàng hiển thị tiền thừa */}
              <TableRow>
                <TableCell colSpan={3} align="right">
                  <Typography fontWeight="bold">Tiền thừa trả khách</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography fontWeight="bold" color="success.main">
                    {formatCurrency(amountOwed < 0 ? -amountOwed : 0)}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions sx={{ p: "16px 24px" }}>
        <SoftButton
          variant="gradient"
          color="success"
          size="large"
          onClick={handleConfirm}
          fullWidth
        >
          Xác nhận
        </SoftButton>
      </DialogActions>
    </Dialog>
  );
}

// Định nghĩa PropTypes để quản lý props tốt hơn
PaymentModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  totalAmount: PropTypes.number.isRequired,
  onConfirm: PropTypes.func.isRequired,
  hoaDonId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default PaymentModal;
