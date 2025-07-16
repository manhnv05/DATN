// src/layouts/BanHangTaiQuay/component/Pay.jsx

import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Divider,
  TextField,
  Switch,
  FormControlLabel,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import axios from "axios";

// Import components và icons
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import Card from "@mui/material/Card";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
// Import các component con
import ShippingForm from "./ShippingForm";
import CustomerTable from "./CustomerTable";
import AddressSelectionModal from "./AddressSelectionModal";
import AddAddressModal from "./AddAddressModal";
import PaymentModal from "./PaymentModal";
import CalculateIcon from "@mui/icons-material/Calculate";
import { InputAdornment } from "@mui/material";

// Hàm định dạng tiền tệ
const formatCurrency = (amount) => {
  if (typeof amount !== "number" || isNaN(amount)) return "0 VND";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
};

// === COMPONENT CHÍNH: PAY ===
function Pay({ totalAmount, hoaDonId, onSaveOrder, onDataChange }) {
  const [isDelivery, setIsDelivery] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);
  const [discountValue, setDiscountValue] = useState(0);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [voucherCode, setVoucherCode] = useState(""); // Để hiển thị trong TextField
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [suggestedVoucher, setSuggestedVoucher] = useState(null);
  const [bestidVoucher, setBestidVoucher] = useState(null);

  const [customer, setCustomer] = useState({ id: null, tenKhachHang: "Khách lẻ" });
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [shippingFormData, setShippingFormData] = useState(null);

  const [shippingAddress, setShippingAddress] = useState(null);

  const finalTotal = totalAmount + (isDelivery ? shippingFee : 0) - discountValue;
  const amountOwed = finalTotal - Number(customer || 0);
  // <<< THÊM STATE CHO MODAL ĐỊA CHỈ
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressList, setAddressList] = useState([]);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const handleOpenAddModalFromSelectModal = () => {
    setIsAddressModalOpen(false); // Đóng modal chọn địa chỉ hiện tại
    setIsAddAddressModalOpen(true); // Mở modal thêm địa chỉ mới
  };
  // Tính toán tiền dựa trên `paymentDetails`
  const totalPaid = paymentDetails.reduce((sum, p) => sum + p.soTienThanhToan, 0);
  const changeToCustomer = totalPaid - finalTotal;
  const handleDeliveryToggle = (event) => {
    const isChecked = event.target.checked;
    setIsDelivery(isChecked);
    setShippingFee(isChecked ? 30000 : 0);
    if (!isChecked) {
      setShippingFormData(null);
      setShippingAddress(null);
    }
  };
  const handleFormChange = useCallback((formData) => {
    console.log("LOG 3 (Pay): Đã nhận dữ liệu từ con ->", formData);
    setShippingFormData(formData);
  }, []); // Mảng dependency rỗng, hàm chỉ được tạo 1 lần
  const resetForm = useCallback(() => {
    console.log("--- RESETTING FORM ---");
    setIsDelivery(false);
    setShippingFee(0);
    setDiscountValue(0);
    setPaymentDetails([]);
    setCustomer({ id: null, tenKhachHang: "Khách lẻ" });
    setShippingAddress(null);
  }, []);
  useEffect(() => {
    if (hoaDonId) {
      resetForm();
    }
  }, [hoaDonId, resetForm]);

  useEffect(() => {
    if (onDataChange) {
      const dataToSend = {
        customer,
        isDelivery,
        shippingFee,
        shippingInfo: isDelivery ? shippingFormData : null,
        phieuGiamGia: appliedVoucher, // Gửi cả object phiếu giảm giá đã áp dụng
        tongTienGiam: discountValue, // Gửi số tiền đã được giảm
      };
      // <<< LOG 4: Dữ liệu Pay chuẩn bị GỬI ĐI >>>
      console.log("LOG 4 (Pay): Đang gửi dữ liệu lên ->", dataToSend);
      onDataChange(dataToSend);
    }
  }, [customer, isDelivery, shippingFee, shippingFormData, onDataChange, paymentDetails]);
  const handleSelectCustomer = async (selectedCustomer) => {
    setCustomer(selectedCustomer);
    try {
      const response = await axios.get(
        `http://localhost:8080/diaChi/get-all-dia-chi-by-khach-hang/${selectedCustomer.id}`
      );
      const addresses = response.data;
      if (addresses && addresses.length > 0) {
        setShippingAddress(addresses[0]);
      } else {
        setShippingAddress(null);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách địa chỉ:", error);
      setShippingAddress(null);
    }
    setIsCustomerModalOpen(false);
  };

  const handleConfirmPayment = async (newPaymentsFromModal) => {
    // `newPaymentsFromModal` giờ đây đã là một mảng đúng
    if (!newPaymentsFromModal || newPaymentsFromModal.length === 0) {
      setIsPaymentModalOpen(false);
      return;
    }

    try {
      const savedPayments = [];
      // Dùng trực tiếp newPaymentsFromModal
      for (const payment of newPaymentsFromModal) {
        const payload = { ...payment, idHoaDon: hoaDonId };
        const response = await axios.post("http://localhost:8080/chiTietThanhToan", payload);
        savedPayments.push(response.data.data);
      }

      // Cập nhật state với một mảng dữ liệu hợp lệ
      setPaymentDetails((prevDetails) => [...prevDetails, ...savedPayments]);
      alert("Các khoản thanh toán đã được ghi nhận thành công!");
      setIsPaymentModalOpen(false);
    } catch (error) {
      console.error("Lỗi trong quá trình thanh toán:", error);
      alert(`Có lỗi xảy ra: ${error.response?.data?.message || "Lỗi không xác định"}`);
    }
  };
  const handleFinalSave = () => {
    if (!isDelivery) {
      const totalPaid = paymentDetails.reduce((sum, p) => sum + p.soTienThanhToan, 0);

      // Bắt buộc phải thanh toán đủ
      if (totalPaid < finalTotal) {
        alert(
          `Thanh toán chưa đủ! Khách hàng cần trả thêm ${formatCurrency(
            finalTotal - totalPaid
          )}. Vui lòng hoàn tất thanh toán.`
        );
        return;
      }
    }
    console.log("Validation OK. Proceeding to save order.");
    const latestPaymentData = {
      customer: customer,
      isDelivery: isDelivery,
      shippingFee: shippingFee,
      shippingInfo: isDelivery ? shippingFormData : null,
      phieuGiamGia: appliedVoucher,
      tongTienGiam: discountValue,
    };
    console.log("DỮ LIỆU CHUẨN BỊ GỬI TỪ PAY:", latestPaymentData);
    onSaveOrder(latestPaymentData);
  };
  const handleClearCustomer = () => {
    setCustomer({ id: null, tenKhachHang: "Khách lẻ" });
    setShippingAddress(null);
  };

  // <<< THÊM HÀM MỞ MODAL VÀ GỌI API
  const handleOpenAddressModal = async () => {
    // Chỉ thực hiện nếu đã có khách hàng được chọn
    if (!customer || !customer.id) {
      alert("Vui lòng chọn một khách hàng trước.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/diaChi/get-all-dia-chi-by-khach-hang/${customer.id}`
      );
      setAddressList(response.data || []);
      setIsAddressModalOpen(true); // Mở modal
    } catch (error) {
      console.error("Lỗi khi lấy danh sách địa chỉ:", error);
      setAddressList([]);
      setIsAddressModalOpen(true); // Vẫn mở modal để hiển thị thông báo rỗng
    }
  };
  // <<< THÊM HÀM XỬ LÝ KHI CHỌN ĐỊA CHỈ TỪ MODAL
  const handleSelectAddressFromModal = (selectedAddress) => {
    setShippingAddress(selectedAddress); // Cập nhật địa chỉ chính
    setIsAddressModalOpen(false); // Đóng modal
  };
  const handleAddressAdded = () => {
    setIsAddAddressModalOpen(false); // Đóng modal "Thêm địa chỉ"
    handleOpenAddressModal(); // Mở lại modal "Chọn địa chỉ" để làm mới danh sách
  };
  // 1. useEffect: Tự động tìm và gợi ý phiếu tốt nhất khi tổng tiền hoặc khách hàng thay đổi
  useEffect(() => {
    // Chỉ chạy khi có khách hàng (khác khách lẻ) và có tiền hàng
    if (customer && customer.id && totalAmount > 0) {
      const fetchBestVoucher = async () => {
        try {
          const requestBody = {
            khachHang: customer.id,
            tongTienHoaDon: totalAmount,
          };
          const response = await axios.post(
            "http://localhost:8080/PhieuGiamGiaKhachHang/query",
            requestBody,
            { params: { page: 0, size: 1 } }
          );

          const vouchers = response.data.data.content;
          if (vouchers && vouchers.length > 0) {
            const bestVoucher = vouchers[0];
            setSuggestedVoucher(bestVoucher); // Lưu lại phiếu gợi ý
            setAppliedVoucher(bestVoucher); // Mặc định áp dụng phiếu tốt nhất
            setVoucherCode(bestVoucher.phieuGiamGia.maPhieuGiamGia); // Hiển thị mã ra ô input
          } else {
            // Nếu không có phiếu nào phù hợp
            setSuggestedVoucher(null);
            setAppliedVoucher(null);
            setVoucherCode("");
          }
        } catch (error) {
          console.error("Lỗi khi tìm phiếu giảm giá gợi ý:", error);
          setSuggestedVoucher(null);
          setAppliedVoucher(null);
          setVoucherCode("");
        }
      };
      fetchBestVoucher();
    } else {
      // Reset khi không đủ điều kiện (khách lẻ hoặc chưa có hàng)
      setSuggestedVoucher(null);
      setAppliedVoucher(null);
      setVoucherCode("");
    }
  }, [totalAmount, customer?.id]); // Phụ thuộc vào thay đổi của tổng tiền và ID khách hàng
  useEffect(() => {
    if (appliedVoucher && totalAmount > 0) {
      const voucherDetails = appliedVoucher.phieuGiamGia;
      let calculatedDiscount = 0;

      if (voucherDetails.phamTramGiamGia) {
        calculatedDiscount = (totalAmount * voucherDetails.phamTramGiamGia) / 100;
        if (voucherDetails.giamToiDa && calculatedDiscount > voucherDetails.giamToiDa) {
          calculatedDiscount = voucherDetails.giamToiDa;
        }
      } else if (voucherDetails.soTienGiam) {
        calculatedDiscount = voucherDetails.soTienGiam;
      }
      setDiscountValue(calculatedDiscount);
    } else {
      setDiscountValue(0);
    }
  }, [appliedVoucher, totalAmount]);

  // 3. Handler: Xử lý khi người dùng nhấn nút "ÁP DỤNG"
  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      setAppliedVoucher(suggestedVoucher);
      setVoucherCode(suggestedVoucher ? suggestedVoucher.phieuGiamGia.maPhieuGiamGia : "");
      alert(suggestedVoucher ? "Đã quay về mã giảm giá tốt nhất!" : "Đã bỏ áp dụng mã giảm giá.");
      return;
    }

    if (!customer || !customer.id) {
      alert("Vui lòng chọn khách hàng trước khi áp dụng mã!");
      return;
    }

    try {
      // Giả sử bạn đã có API: GET /PhieuGiamGiaKhachHang/find-by-code
      const response = await axios.get("http://localhost:8080/PhieuGiamGiaKhachHang/find-by-code", {
        params: { maPhieu: voucherCode, idKhachHang: customer.id },
      });
      const foundVoucher = response.data.data;

      if (totalAmount < foundVoucher.phieuGiamGia.dieuKienGiam) {
        alert(
          `Mã này yêu cầu hóa đơn tối thiểu ${formatCurrency(
            foundVoucher.phieuGiamGia.dieuKienGiam
          )}!`
        );
        return;
      }
      setAppliedVoucher(foundVoucher);
      alert(`Đã áp dụng thành công mã: ${foundVoucher.phieuGiamGia.ma}`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Mã giảm giá không hợp lệ.";
      alert(errorMessage);
      setAppliedVoucher(null);
    }
  };

  return (
    <>
      {/* Thẻ Card là thẻ bao bọc chính cho toàn bộ giao diện */}
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <SoftBox p={2} sx={{ flexGrow: 1 }}>
          <Grid container spacing={3}>
            {/* CỘT TRÁI */}
            <Grid item xs={12} lg={7}>
              <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <SoftTypography variant="h5" fontWeight="bold">
                  Khách hàng
                </SoftTypography>

                {/* <<< Nhóm nút Chọn và Bỏ chọn */}
                <Box display="flex" gap={1}>
                  {customer.id && (
                    <SoftButton
                      variant="outlined"
                      color="secondary"
                      startIcon={<CloseIcon />}
                      onClick={handleClearCustomer}
                    >
                      BỎ CHỌN
                    </SoftButton>
                  )}
                  <SoftButton
                    variant="outlined"
                    color="info"
                    startIcon={<PersonSearchIcon />}
                    onClick={() => setIsCustomerModalOpen(true)}
                  >
                    CHỌN KHÁCH HÀNG
                  </SoftButton>
                </Box>
              </SoftBox>
              <Divider sx={{ mb: 3 }} />

              {/* <<< Khối hiển thị thông tin khách hàng nằm ở ĐÚNG VỊ TRÍ NÀY */}
              {isDelivery ? (
                <ShippingForm
                  initialCustomer={customer}
                  initialAddress={shippingAddress}
                  onOpenAddressModal={handleOpenAddressModal}
                  DÒNG
                  onFormChange={handleFormChange}
                />
              ) : (
                <Box>
                  <SoftTypography variant="body1" color="text" fontWeight="medium">
                    TÊN KHÁCH HÀNG
                  </SoftTypography>
                  <Box sx={{ p: 1.5, border: "1px solid #ddd", borderRadius: "8px", mt: 1 }}>
                    <SoftTypography variant="h6">{customer.tenKhachHang}</SoftTypography>
                  </Box>
                </Box>
              )}
            </Grid>

            {/* CỘT PHẢI (Thanh toán) */}
            <Grid item xs={12} lg={5}>
              <FormControlLabel
                control={<Switch checked={isDelivery} onChange={handleDeliveryToggle} />}
                label={<Typography variant="h6">Giao hàng</Typography>}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Phiếu giảm giá"
                sx={{ mb: 3 }}
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)} // Cho phép người dùng nhập
                helperText={
                  appliedVoucher
                    ? `Đang áp dụng mã: ${appliedVoucher.phieuGiamGia.maPhieuGiamGia}`
                    : "Nhập mã giảm giá (nếu có)"
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SoftButton
                        variant="text"
                        color="info"
                        onClick={handleApplyVoucher} // Thêm hàm xử lý áp dụng
                      >
                        ÁP DỤNG
                      </SoftButton>
                    </InputAdornment>
                  ),
                }}
              />

              <SoftBox display="flex" flexDirection="column" gap={2}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1">Tiền hàng</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatCurrency(totalAmount)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1">Phí vận chuyển</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatCurrency(isDelivery ? shippingFee : 0)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1">Giảm giá</Typography>
                  <Typography variant="body1" fontWeight="bold" color="error">
                    - {formatCurrency(discountValue)}
                  </Typography>
                </Box>
                <Divider />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h5" fontWeight="bold">
                    Tổng tiền
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="error.main">
                    {formatCurrency(finalTotal)}
                  </Typography>
                </Box>
              </SoftBox>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="h6" fontWeight="medium">
                    Khách thanh toán:
                  </Typography>
                  {totalPaid < finalTotal && (
                    <IconButton
                      color="info"
                      onClick={() => setIsPaymentModalOpen(true)}
                      sx={{ border: "1px solid #ddd", borderRadius: "8px" }}
                    >
                      <i className="fa-solid fa-calculator"></i>
                    </IconButton>
                  )}
                </Box>
                <Typography variant="h6" color="info.main" fontWeight="bold">
                  {/* Dùng hàm formatCurrency để hiển thị số tiền cho đẹp */}
                  {formatCurrency(totalPaid)}
                </Typography>
              </Box>
              <Divider sx={{ my: 3 }} />

              <Box display="flex" justifyContent="space-between">
                <Typography variant="body1">Tiền thừa trả khách:</Typography>
                <Typography variant="body1" fontWeight="bold" color="success.main">
                  {formatCurrency(amountOwed < 0 ? -amountOwed : 0)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </SoftBox>

        {/* Nút Thanh toán */}
        <SoftBox p={2} mt="auto">
          <SoftButton
            variant="contained"
            color={isDelivery ? "info" : "success"}
            size="large"
            fullWidth
            // <<< GẮN HÀM onSaveOrder VÀO SỰ KIỆN onClick
            onClick={handleFinalSave}
          >
            <Typography variant="h6" color="white" fontWeight="bold">
              {isDelivery ? "LƯU VÀ ĐẶT HÀNG" : "LƯU VÀ THANH TOÁN"}
            </Typography>
          </SoftButton>
        </SoftBox>
      </Card>

      {/* MODAL CHỌN KHÁCH HÀNG */}
      <Dialog
        open={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <SoftTypography variant="h5">Chọn khách hàng</SoftTypography>
            <IconButton onClick={() => setIsCustomerModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <CustomerTable isSelectionMode={true} onSelectCustomer={handleSelectCustomer} />
        </DialogContent>
      </Dialog>
      <AddressSelectionModal
        open={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        addresses={addressList}
        onSelectAddress={handleSelectAddressFromModal}
        onOpenAddAddressModal={handleOpenAddModalFromSelectModal}
      />
      <AddAddressModal
        open={isAddAddressModalOpen}
        onClose={() => setIsAddAddressModalOpen(false)}
        customerId={customer.id}
        onAddressAdded={handleAddressAdded}
      />
      <PaymentModal
        open={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={finalTotal}
        onConfirm={handleConfirmPayment}
        hoaDonId={hoaDonId}
      />
    </>
  );
}

// Bạn cũng có thể thêm giá trị mặc định cho props
Pay.defaultProps = {
  totalAmount: 0,
};
Pay.propTypes = {
  totalAmount: PropTypes.number,
  hoaDonId: PropTypes.number,
  onSaveOrder: PropTypes.func.isRequired,
  onSaveOrder: PropTypes.func.isRequired,
  onDataChange: PropTypes.func.isRequired,
};
export default Pay;
