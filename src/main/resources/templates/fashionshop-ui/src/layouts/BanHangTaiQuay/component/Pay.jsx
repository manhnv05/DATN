// src/layouts/BanHangTaiQuay/component/Pay.jsx

import React, { useState } from "react";
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
import PropTypes from 'prop-types';
// Import các component con
import ShippingForm from "./ShippingForm"; 
import CustomerTable from "./CustomerTable";
import AddressSelectionModal from "./AddressSelectionModal";
import AddAddressModal from "./AddAddressModal";

// Hàm định dạng tiền tệ
const formatCurrency = (amount) => {
  if (typeof amount !== "number" || isNaN(amount)) return "0 VND";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
};

// === COMPONENT CHÍNH: PAY ===
function Pay({ totalAmount }) {

  const [isDelivery, setIsDelivery] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);
  const [discountValue, setDiscountValue] = useState(250000);
  const [customerPayment, setCustomerPayment] = useState('');
  
  const [customer, setCustomer] = useState({ id: null, tenKhachHang: "Khách lẻ" });
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  
  const [shippingAddress, setShippingAddress] = useState(null);

   const finalTotal = totalAmount + (isDelivery ? shippingFee : 0) - discountValue;
  const amountOwed = finalTotal - Number(customerPayment || 0);
    // <<< THÊM STATE CHO MODAL ĐỊA CHỈ
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressList, setAddressList] = useState([]);
    const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
   const handleOpenAddModalFromSelectModal = () => {
    setIsAddressModalOpen(false); // Đóng modal chọn địa chỉ hiện tại
    setIsAddAddressModalOpen(true);  // Mở modal thêm địa chỉ mới
  };

  const handleDeliveryToggle = (event) => {
    const isChecked = event.target.checked;
    setIsDelivery(isChecked);
    setShippingFee(isChecked ? 30000 : 0);
  };
  
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
    handleOpenAddressModal();      // Mở lại modal "Chọn địa chỉ" để làm mới danh sách
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
                <SoftTypography variant="h5" fontWeight="bold">Khách hàng</SoftTypography>
                
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
                />
              ) : (
                <Box>
                  <SoftTypography variant="body1" color="text" fontWeight="medium">TÊN KHÁCH HÀNG</SoftTypography>
                  <Box sx={{ p: 1.5, border: "1px solid #ddd", borderRadius: "8px", mt: 1 }}>
                    <SoftTypography variant="h6">{customer.tenKhachHang}</SoftTypography>
                  </Box>
                </Box>
              )}
            </Grid>

            {/* CỘT PHẢI (Thanh toán) */}
            <Grid item xs={12} lg={5}>
              <FormControlLabel control={<Switch checked={isDelivery} onChange={handleDeliveryToggle} />} label={<Typography variant="h6">Giao hàng</Typography>} sx={{ mb: 2 }} />
              <TextField fullWidth label="Phiếu giảm giá" sx={{ mb: 3 }} />
              
              <SoftBox display="flex" flexDirection="column" gap={2}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body1">Tiền hàng</Typography>
                    <Typography variant="body1" fontWeight="bold">{formatCurrency(totalAmount)}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body1">Phí vận chuyển</Typography>
                    <Typography variant="body1" fontWeight="bold">{formatCurrency(isDelivery ? shippingFee : 0)}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body1">Giảm giá</Typography>
                    <Typography variant="body1" fontWeight="bold" color="error">- {formatCurrency(discountValue)}</Typography>
                  </Box>
                  <Divider />
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" fontWeight="bold">Tổng tiền</Typography>
                    <Typography variant="h5" fontWeight="bold" color="error.main">{formatCurrency(finalTotal)}</Typography>
                  </Box>
                </SoftBox>

                <Divider sx={{ my: 3 }} />

                <TextField fullWidth label="Khách thanh toán" type="text" value={customerPayment} onChange={(e) => setCustomerPayment(e.target.value)} sx={{ mb: 2 }} />
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body1">Tiền thừa trả khách:</Typography>
                  <Typography variant="body1" fontWeight="bold" color="success.main">{formatCurrency(amountOwed < 0 ? -amountOwed : 0)}</Typography>
                </Box>
            </Grid>
          </Grid>
        </SoftBox>

        {/* Nút Thanh toán */}
        <SoftBox p={2} mt="auto">
          <SoftButton variant="contained" color={isDelivery ? "info" : "success"} size="large" fullWidth>
            <Typography variant="h6" color="white" fontWeight="bold">
              {isDelivery ? "Xác nhận đặt hàng" : "Thanh toán"}
            </Typography>
          </SoftButton>
        </SoftBox>
      </Card>

      {/* MODAL CHỌN KHÁCH HÀNG */}
      <Dialog open={isCustomerModalOpen} onClose={() => setIsCustomerModalOpen(false)} fullWidth maxWidth="lg">
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <SoftTypography variant="h5">Chọn khách hàng</SoftTypography>
            <IconButton onClick={() => setIsCustomerModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <CustomerTable 
            isSelectionMode={true} 
            onSelectCustomer={handleSelectCustomer} 
          />
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
    </>
  );
}
Pay.propTypes = {
  totalAmount: PropTypes.number,
};

// Bạn cũng có thể thêm giá trị mặc định cho props
Pay.defaultProps = {
  totalAmount: 0,
};
export default Pay;