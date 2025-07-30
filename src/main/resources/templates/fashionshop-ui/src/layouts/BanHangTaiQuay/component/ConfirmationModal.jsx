import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import axios from "axios";

// Import các component dùng chung
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Hàm format tiền tệ (nên được import từ file utils)
const formatCurrency = (amount) => {
  if (typeof amount !== "number" || isNaN(amount)) {
    return "N/A";
  }
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
};

function ConfirmationModal({ open, onClose, onConfirm, product, quantity, setQuantity }) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && product && product.soLuongTonKho !== undefined) {
      // Đảm bảo số lượng không vượt quá tồn kho và tối thiểu là 1
      if (quantity <= 0 && product.soLuongTonKho > 0) {
        // setQuantity(1); // Mặc định là 1 nếu số lượng hiện tại không hợp lệ nhưng còn hàng
      } else if (quantity > product.soLuongTonKho) {
        setQuantity(product.soLuongTonKho); // Giới hạn số lượng bằng tồn kho
      }
    }
  }, [open, product, quantity, setQuantity]);
  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) {
      setQuantity(1);
    } else if (value > product.soLuongTonKho) {
      setQuantity(product.soLuongTonKho);
    } else {
      setQuantity(value);
    }
  };
    if (!product) return null;
  const handleConfirmClick = async () => {
    setIsLoading(true);
    try {
      // BƯỚC 1: GỌI API ĐỂ GIẢM SỐ LƯỢNG TRONG KHO
      await axios.put(
        `http://localhost:8080/api/hoa-don/giam-so-luong-san-pham/${product.idChiTietSanPham}`,
        null,
        {
          params: {
            soLuong: quantity,
          },
        }
      );

  
      onConfirm({ ...product, quantity });

      // BƯỚC 3: ĐÓNG MODAL
      onClose();
    } catch (error) {
      console.error("Lỗi khi trừ số lượng tồn kho:", error);
      alert(`Lỗi: ${error.response?.data?.message || "Không thể thêm sản phẩm."}`);
    } finally {
      // Dù thành công hay thất bại, luôn dừng trạng thái loading
      setIsLoading(false);
    }
  };

  const isConfirmButtonDisabled = quantity > product.soLuongTonKho || quantity < 1;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      {/* PHẦN TIÊU ĐỀ */}
      <DialogTitle
        sx={{ py: 2, px: 3, bgcolor: "grey.100", borderBottom: 1, borderColor: "divider" }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <SoftTypography variant="h6" fontWeight="bold">
            {`${product.tenSanPham} - ${product.mauSac}`}
          </SoftTypography>
          <IconButton onClick={onClose} size="small" sx={{ mr: -1 }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      {/* PHẦN NỘI DUNG */}
      <DialogContent dividers sx={{ p: 3 }}>
        <SoftBox>
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Loại sản phẩm:{" "}
              <SoftTypography component="span" variant="body2" fontWeight="bold">
                {product.danhMuc}
              </SoftTypography>
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Thương hiệu:{" "}
              <SoftTypography component="span" variant="body2" fontWeight="bold">
                {product.thuongHieu}
              </SoftTypography>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Size:{" "}
              <SoftTypography component="span" variant="body2" fontWeight="bold">
                {product.kichThuoc}
              </SoftTypography>
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Số lượng tồn kho:{" "}
            <SoftTypography
              component="span"
              variant="body2"
              fontWeight="bold"
              color={product.soLuongTonKho === 0 ? "error" : "error"}
            >
              {product.soLuongTonKho ?? "N/A"}
            </SoftTypography>
          </Typography>
           <Box textAlign="center" my={2}>
            {product.phanTramGiam > 0 && product.giaTienSauKhiGiam < product.gia ? (
              <>
                {/* Giá gốc bị gạch ngang */}
                <SoftTypography
                  variant="h6"
                  color="text.secondary"
                  fontWeight="regular"
                  sx={{ textDecoration: "line-through" }}
                >
                  {formatCurrency(product.gia)}
                </SoftTypography>
                {/* Giá sau khi giảm */}
                <SoftTypography variant="h4" color="error" fontWeight="bold">
                  {formatCurrency(product.giaTienSauKhiGiam)}
                </SoftTypography>
              </>
            ) : (
              // Nếu không giảm giá, chỉ hiển thị giá gốc
              <SoftTypography variant="h4" color="info" fontWeight="bold">
                {formatCurrency(product.gia)}
              </SoftTypography>
            )}
          </Box>

          {/* PHẦN NHẬP SỐ LƯỢNG */}
          <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
            <SoftTypography variant="body1" fontWeight="bold" mr={2}>
              Số lượng:
            </SoftTypography>
            <IconButton
              onClick={handleDecrement}
              size="small"
              disabled={quantity <= 1}
              sx={{ border: 1, borderColor: "divider", borderRadius: 2 }}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            <TextField
              value={quantity}
              onChange={handleQuantityChange}
              type="number"
              inputProps={{
                style: { textAlign: "center" },
                min: 1, // Min luôn là 1
                max: product.soLuongTonKho, // Max là số lượng tồn kho
              }}
              sx={{ width: "70px", mx: 1 }}
            />
            <IconButton
              onClick={handleIncrement}
              size="small"
              disabled={quantity >= product.soLuongTonKho} // Vô hiệu hóa nút tăng nếu số lượng đạt max tồn kho
              sx={{ border: 1, borderColor: "divider", borderRadius: 2 }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
        </SoftBox>
      </DialogContent>

      {/* PHẦN NÚT HÀNH ĐỘNG */}
      <DialogActions sx={{ p: 2, bgcolor: "grey.100", borderTop: 1, borderColor: "divider" }}>
        <Button
          onClick={handleConfirmClick}
          variant="contained"
          color="info"
          size="large"
          fullWidth
          sx={{ fontWeight: "bold" }}
        >
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  product: PropTypes.object,
  quantity: PropTypes.number.isRequired,
  setQuantity: PropTypes.func.isRequired,
  soLuongTonKho: PropTypes.number.isRequired,
};

export default ConfirmationModal;
