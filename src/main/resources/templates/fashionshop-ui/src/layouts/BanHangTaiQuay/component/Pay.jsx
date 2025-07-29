// src/layouts/BanHangTaiQuay/component/Pay.jsx

import React, { useState, useEffect, useCallback, useRef } from "react";
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
import { toast } from "react-toastify";
import InHoaDon from "../../HoaDon/InHoaDon/InHoaDon";
import PaymentIcon from "@mui/icons-material/Payment";
// Hàm định dạng tiền tệ
const formatCurrency = (amount) => {
  if (typeof amount !== "number" || isNaN(amount)) return "0 VND";
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
};

function Pay({ totalAmount, hoaDonId, onSaveOrder, onDataChange, completedOrderId }) {
  const hoaDonDataRef = useRef({});

  const [isDelivery, setIsDelivery] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);
  const [discountValue, setDiscountValue] = useState(0);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [suggestedVoucher, setSuggestedVoucher] = useState(null);
  const [bestidVoucher, setBestidVoucher] = useState(null);

  const [customer, setCustomer] = useState({ id: null, tenKhachHang: "Khách lẻ" });
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [shippingFormData, setShippingFormData] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(null);

  const finalTotal = totalAmount + (isDelivery ? shippingFee : 0) - discountValue;
  const amountOwed = finalTotal - Number(customer || 0);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressList, setAddressList] = useState([]);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [isCalculatingFee, setIsCalculatingFee] = useState(false);
  // Tính toán tiền dựa trên `paymentDetails`
  const totalPaid = paymentDetails.reduce((sum, p) => sum + p.soTienThanhToan, 0);
  const changeToCustomer = totalPaid - finalTotal;
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceToPrintId, setInvoiceToPrintId] = useState(null);
  const GHN_API_BASE_URL = "https://online-gateway.ghn.vn/shiip/public-api";
  const GHN_TOKEN = "03b71be1-6891-11f0-9e03-7626358ab3e0";
  const ghnApi = axios.create({
  baseURL: GHN_API_BASE_URL,
  headers: {
    token: GHN_TOKEN,
    "Content-Type": "application/json",
  },
});
const getShippingFeeFromGHN = async (shippingInfo) => {
  const shop_id = 5908591;
  const { districtId: to_district_id, wardCode: to_ward_code } = shippingInfo;

  if (!to_district_id || !to_ward_code) {
    return 0;
  }

  // 🔥 GIẢI PHÁP: Thử nhiều district khác nhau trong Hà Nội
  const alternativeDistricts = [
    // Thử district gốc trước
    { district_id: 1450, ward_code: "217010", name: "Cầu Giấy (Gốc)" },
    // Backup districts
    { district_id: 1442, ward_code: "21211", name: "Ba Đình" },
    { district_id: 1443, ward_code: "21311", name: "Hoàn Kiếm" },
    { district_id: 1447, ward_code: "21711", name: "Đống Đa" },
    { district_id: 1448, ward_code: "21811", name: "Hai Bà Trưng" },
    { district_id: 1451, ward_code: "22111", name: "Thanh Xuân" },
  ];

  // Thử từng district cho đến khi thành công
  for (const altDistrict of alternativeDistricts) {
    const from_district_id = altDistrict.district_id;
    const from_ward_code = altDistrict.ward_code;

    console.log(`🔄 Đang thử: ${altDistrict.name} (${from_district_id})`);

    try {
      // Bước 1: Kiểm tra dịch vụ khả dụng
      const serviceResponse = await axios.get(
        `${GHN_API_BASE_URL}/v2/shipping-order/available-services`,
        {
          params: {
            shop_id: shop_id,
            from_district: from_district_id,
            to_district: to_district_id,
          },
          headers: {
            'token': GHN_TOKEN,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!serviceResponse.data?.data || serviceResponse.data.data.length === 0) {
        console.log(`❌ Không có dịch vụ cho ${altDistrict.name}`);
        continue;
      }

      // Bước 2: Tính phí vận chuyển
      const selectedService = serviceResponse.data.data[0];
      const service_id = selectedService.service_id;
      const service_type_id = selectedService.service_type_id;

      const feePayload = {
        service_id: service_id,
        service_type_id: service_type_id,
        from_district_id: from_district_id,
        from_ward_code: from_ward_code,
        to_district_id: to_district_id,
        to_ward_code: to_ward_code,
        height: 20,
        length: 30,
        weight: 500,
        width: 15,
        insurance_value: 0,
        coupon: null,
        cod_failed_amount: 0,
      };

      const feeResponse = await axios.post(
        `${GHN_API_BASE_URL}/v2/shipping-order/fee`,
        feePayload,
        {
          headers: {
            'token': GHN_TOKEN,
            'ShopId': shop_id,
            'Content-Type': 'application/json',
          },
        }
      );

      if (feeResponse.data?.code === 200) {
        console.log(`✅ Thành công với ${altDistrict.name}!`);
        console.log(`💰 Phí vận chuyển: ${feeResponse.data.data.total} VND`);
        
        // Thông báo cho user biết đang dùng địa chỉ backup (nếu không phải district gốc)
        if (from_district_id !== 1450) {
          // toast.info(`Đang sử dụng điểm gửi tại ${altDistrict.name} để tính phí vận chuyển.`);
        }
        
        return feeResponse.data.data.total;
      }

    } catch (error) {
      const errorCode = error.response?.data?.code_message;
      console.log(`❌ Lỗi với ${altDistrict.name}: ${errorCode}`);
      
      // Nếu không phải lỗi district invalid thì dừng (có thể lỗi khác)
      if (errorCode !== 'SEND_DISTRICT_IS_INVALID') {
        console.error("Lỗi không phải district invalid:", error.response?.data);
        break;
      }
      continue;
    }
  }

  // 🎯 FALLBACK: Nếu tất cả districts đều fail, dùng phí ước tính
  console.log("🔄 Tất cả districts đều fail, sử dụng phí ước tính");
  
  const estimatedFee = getEstimatedShippingFee(to_district_id);
  toast.warning(`Không thể tính phí chính xác. Sử dụng phí ước tính: ${formatCurrency(estimatedFee)}`);
  
  return estimatedFee;
};

// Hàm tính phí ước tính dựa trên district đích
const getEstimatedShippingFee = (to_district_id) => {
  // Phí ước tính dựa trên khoảng cách (có thể customize)
  const feeRanges = {
    // Nội thành Hà Nội (1442-1465)
    hanoi_inner: 25000,
    // Ngoại thành Hà Nội (1466-1490) 
    hanoi_outer: 35000,
    // TP.HCM và các thành phố lớn
    major_cities: 45000,
    // Các tỉnh khác
    other_provinces: 55000,
  };

  if (to_district_id >= 1442 && to_district_id <= 1465) {
    return feeRanges.hanoi_inner;
  } else if (to_district_id >= 1466 && to_district_id <= 1490) {
    return feeRanges.hanoi_outer;
  } else if (to_district_id >= 1460 && to_district_id <= 1520) {
    return feeRanges.major_cities;
  } else {
    return feeRanges.other_provinces;
  }
};
  // Hàm lưu dữ liệu hiện tại vào ref
  const saveCurrentData = useCallback(() => {
    if (hoaDonId) {
      hoaDonDataRef.current[hoaDonId] = {
        isDelivery,
        shippingFee,
        discountValue,

        voucherCode,
        appliedVoucher,
        suggestedVoucher,
        customer,
        shippingFormData,
        shippingAddress,
        paymentDetails,
      };
    }
  }, [
    hoaDonId,
    isDelivery,
    shippingFee,
    discountValue,
    voucherCode,
    appliedVoucher,
    suggestedVoucher,
    customer,
    shippingFormData,
    shippingAddress,
    paymentDetails,
  ]);

  useEffect(() => {
    if (completedOrderId) {
      const orderToClose = orders.find((o) => o.idHoaDonBackend === completedOrderId);

      if (orderToClose) {
        handleCloseOrderTab(orderToClose.id);
      }
    }
  }, [completedOrderId]);

  const restoreData = useCallback(() => {
    if (hoaDonId && hoaDonDataRef.current[hoaDonId]) {
      const savedData = hoaDonDataRef.current[hoaDonId];
      setIsDelivery(savedData.isDelivery);
      setShippingFee(savedData.shippingFee);
      setDiscountValue(savedData.discountValue);
      setVoucherCode(savedData.voucherCode);
      setAppliedVoucher(savedData.appliedVoucher);
      setSuggestedVoucher(savedData.suggestedVoucher);
      setCustomer(savedData.customer);
      setShippingFormData(savedData.shippingFormData);
      setShippingAddress(savedData.shippingAddress);
      setPaymentDetails(savedData.paymentDetails || []);
    } else {
      // Reset về giá trị mặc định nếu chưa có dữ liệu được lưu
      resetToDefault();

      // Sau khi reset, gọi API tìm voucher tốt nhất cho khách lẻ
      if (totalAmount > 0) {
        fetchBestVoucherForCustomer(null);
      }
    }
  }, [hoaDonId, totalAmount]);

  const resetToDefault = useCallback(() => {
    setIsDelivery(false);
    setShippingFee(0);
    setDiscountValue(0);
    setPaymentDetails([]); // <-- DÒNG QUAN TRỌNG ĐỂ SỬA LỖI
    setVoucherCode("");
    setAppliedVoucher(null);
    setSuggestedVoucher(null);
    setCustomer({ id: null, tenKhachHang: "Khách lẻ" });
    setShippingFormData(null);
    setShippingAddress(null);
  }, []);

  // Effect để lưu dữ liệu khi có thay đổi
  useEffect(() => {
    saveCurrentData();
  }, [saveCurrentData]);

  // Effect để khôi phục dữ liệu khi chuyển tab (hoaDonId thay đổi)
  useEffect(() => {
    if (hoaDonId) {
      restoreData();
    }
  }, [hoaDonId, restoreData]);

  // Hàm reset form hoàn toàn (có thể dùng khi cần thiết)
  const resetForm = useCallback(() => {
    console.log("--- RESETTING FORM ---");
    if (hoaDonId) {
      delete hoaDonDataRef.current[hoaDonId]; // Xóa dữ liệu đã lưu
    }
    resetToDefault();
  }, [hoaDonId, resetToDefault]);

  const handleOpenAddModalFromSelectModal = () => {
    setIsAddressModalOpen(false);
    setIsAddAddressModalOpen(true);
  };

  const handleDeliveryToggle = (event) => {
    const isChecked = event.target.checked;
    setIsDelivery(isChecked);

    if (!isChecked) {
      setShippingFormData(null);
      setShippingAddress(null);
    }
  };

  const handleFormChange = useCallback((formData) => {
    setShippingFormData(formData);
  }, []);

useEffect(() => {
    // Chỉ tính phí khi bật chế độ giao hàng và có đủ thông tin
    if (isDelivery && shippingFormData && shippingFormData.wardCode) {
      const handleFeeCalculation = async () => {
        setIsCalculatingFee(true);
        const fee = await getShippingFeeFromGHN(shippingFormData);
        setShippingFee(fee);
        setIsCalculatingFee(false);
      };
      handleFeeCalculation();
    }
  }, [shippingFormData, isDelivery]);

  useEffect(() => {
    if (onDataChange) {
      const dataToSend = {
        customer,
        isDelivery,
        shippingFee,
        shippingInfo: isDelivery ? shippingFormData : null,
        phieuGiamGia: appliedVoucher,
        tongTienGiam: discountValue,
      };
      onDataChange(dataToSend);
    }
  }, [customer, isDelivery, shippingFee, shippingFormData, onDataChange, paymentDetails]);

  const handleSelectCustomer = async (selectedCustomer) => {
    setCustomer(selectedCustomer);

    // Reset voucher khi thay đổi khách hàng
    setVoucherCode("");
    setAppliedVoucher(null);
    setSuggestedVoucher(null);
    setDiscountValue(0);

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

    // Gọi API để tìm phiếu giảm giá tốt nhất cho khách hàng mới
    if (totalAmount > 0) {
      await fetchBestVoucherForCustomer(selectedCustomer.id);
    }

    setIsCustomerModalOpen(false);
  };

  const handleConfirmPayment = async (newPaymentsFromModal) => {
    if (!newPaymentsFromModal || newPaymentsFromModal.length === 0) {
      setIsPaymentModalOpen(false);
      return;
    }

    try {
      const savedPayments = [];
      for (const payment of newPaymentsFromModal) {
        const payload = { ...payment, idHoaDon: hoaDonId };
        const response = await axios.post("http://localhost:8080/chiTietThanhToan", payload);
        savedPayments.push(response.data.data);
      }

      setPaymentDetails((prevDetails) => [...prevDetails, ...savedPayments]);
      toast.success("Thanh toán thành công!");
      setIsPaymentModalOpen(false);
    } catch (error) {
      console.error("Lỗi trong quá trình thanh toán:", error);
    }
  };

  const handleFinalSave = async () => {
    if (!isDelivery) {
      const totalPaid = paymentDetails.reduce((sum, p) => sum + p.soTienThanhToan, 0);

      if (totalPaid < finalTotal) {
        toast.error(
          `Thanh toán chưa đủ! Khách hàng cần trả thêm ${formatCurrency(
            finalTotal - totalPaid
          )}. Vui lòng hoàn tất thanh toán.`
        );

        return;
      }
    }

    const latestPaymentData = {
      customer: customer,
      isDelivery: isDelivery,
      shippingFee: shippingFee,
      shippingInfo: isDelivery ? shippingFormData : null,
      phieuGiamGia: appliedVoucher,
      tongTienGiam: discountValue,
    };

    try {
      // Đợi cho đến khi việc lưu đơn hàng hoàn tất
      await onSaveOrder(latestPaymentData);

      // --- LOGIC MỚI ĐỂ IN HÓA ĐƠN ---
      // Chỉ mở modal in nếu là thanh toán tại quầy
      if (!isDelivery) {
        setInvoiceToPrintId(hoaDonId); // Lưu lại ID hóa đơn vừa thanh toán
        setIsInvoiceModalOpen(true); // Mở modal in
      }
      resetForm();
    } catch (error) {
      console.error("Lỗi khi lưu và in hóa đơn:", error);
      // Bạn có thể thêm toast thông báo lỗi ở đây nếu cần
    }

    // resetForm(); // Bỏ comment dòng này nếu muốn reset sau khi lưu
  };

  const handleClearCustomer = async () => {
    setCustomer({ id: null, tenKhachHang: "Khách lẻ" });
    setShippingAddress(null);

    // Reset voucher khi bỏ chọn khách hàng
    setVoucherCode("");
    setAppliedVoucher(null);
    setSuggestedVoucher(null);
    setDiscountValue(0);

    // Gọi API để tìm phiếu giảm giá cho khách lẻ (null)
    if (totalAmount > 0) {
      await fetchBestVoucherForCustomer(null);
    }
  };

  const handleOpenAddressModal = async () => {
    if (!customer || !customer.id) {
      toast.warn("Vui lòng chọn một khách hàng trước.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8080/diaChi/get-all-dia-chi-by-khach-hang/${customer.id}`
      );
      setAddressList(response.data || []);
      setIsAddressModalOpen(true);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách địa chỉ:", error);
      setAddressList([]);
      setIsAddressModalOpen(true);
    }
  };

  const handleSelectAddressFromModal = (selectedAddress) => {
    setShippingAddress(selectedAddress);
    setIsAddressModalOpen(false);
  };

  const handleAddressAdded = () => {
    setIsAddAddressModalOpen(false);
    handleOpenAddressModal();
  };

  // Tách riêng hàm fetch voucher để tái sử dụng
  const fetchBestVoucherForCustomer = async (customerId) => {
    try {
      const requestBody = {
        khachHang: customerId,
        tongTienHoaDon: totalAmount,
      };
      const response = await axios.post(
        "http://localhost:8080/PhieuGiamGiaKhachHang/query",
        requestBody,
        { params: { page: 0, size: 999 } }
      );

      const vouchers = response.data.data.content;
      if (vouchers && vouchers.length > 0) {
        const bestVoucher = vouchers[0];
        setSuggestedVoucher(bestVoucher);
        setAppliedVoucher(bestVoucher);
        setVoucherCode(bestVoucher.maPhieuGiamGia);
      } else {
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

  useEffect(() => {
    if (totalAmount > 0) {
      fetchBestVoucherForCustomer(customer.id);
    } else {
      setSuggestedVoucher(null);
      setAppliedVoucher(null);
      setVoucherCode("");
    }
  }, [totalAmount, customer?.id]);

  useEffect(() => {
    if (appliedVoucher && totalAmount > 0) {
      let calculatedDiscount = 0;

      if (appliedVoucher.phamTramGiamGia) {
        calculatedDiscount = (totalAmount * appliedVoucher.phamTramGiamGia) / 100;
        if (appliedVoucher.giamToiDa && calculatedDiscount > appliedVoucher.giamToiDa) {
          calculatedDiscount = appliedVoucher.giamToiDa;
        }
      } else if (appliedVoucher.soTienGiam) {
        calculatedDiscount = appliedVoucher.soTienGiam;
      }
      setDiscountValue(calculatedDiscount);
    } else {
      setDiscountValue(0);
    }
  }, [appliedVoucher, totalAmount]);

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) {
      setAppliedVoucher(suggestedVoucher);
      setVoucherCode(suggestedVoucher ? suggestedVoucher.phieuGiamGia.maPhieuGiamGia : "");
      toast.info(
        suggestedVoucher ? "Đã quay về mã giảm giá tốt nhất!" : "Đã bỏ áp dụng mã giảm giá."
      );
      return;
    }

    if (!customer || !customer.id) {
      toast.warn("Vui lòng chọn khách hàng trước khi áp dụng mã!");
      return;
    }

    try {
      const response = await axios.get("http://localhost:8080/PhieuGiamGiaKhachHang/find-by-code", {
        params: { maPhieu: voucherCode, idKhachHang: customer.id },
      });
      const foundVoucher = response.data.data;

      if (totalAmount < foundVoucher.phieuGiamGia.dieuKienGiam) {
        toast.error(
          `Mã này yêu cầu hóa đơn tối thiểu ${formatCurrency(
            foundVoucher.phieuGiamGia.dieuKienGiam
          )}!`
        );
        return;
      }
      setAppliedVoucher(foundVoucher);
      toast.success(`Đã áp dụng thành công mã: ${foundVoucher.phieuGiamGia.ma}`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Mã giảm giá không hợp lệ.";
      toast.error(errorMessage);
      setAppliedVoucher(null);
    }
  };
const isDisabled = totalAmount <= 0;
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

              {isDelivery ? (
                <ShippingForm
                  initialCustomer={customer}
                  initialAddress={shippingAddress}
                  onOpenAddressModal={handleOpenAddressModal}
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
                onChange={(e) => setVoucherCode(e.target.value)}
                helperText={
                  appliedVoucher
                    ? `Đang áp dụng mã: ${appliedVoucher.maPhieuGiamGia}`
                    : "Nhập mã giảm giá (nếu có)"
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SoftButton variant="text" color="info" onClick={handleApplyVoucher}>
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
                  {/* --- MODIFIED: Hiển thị phí ship động --- */}
                  <Typography variant="body1">Phí vận chuyển</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {isCalculatingFee ? "Đang tính..." : formatCurrency(isDelivery ? shippingFee : 0)}
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
                      onClick={() => setIsPaymentModalOpen(true)}
                      sx={{ border: "1px solid #ddd", borderRadius: "8px" }}
                    >
                      <PaymentIcon />
                    </IconButton>
                  )}
                </Box>
                <Typography variant="h6" color="info.main" fontWeight="bold">
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

        <SoftBox p={2} mt="auto">
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
            fullWidth
             disabled={isDisabled}
            onClick={handleFinalSave}
          >
            <Typography variant="h6" color="#49a3f1" fontWeight="bold">
              {isDelivery ? " ĐẶT HÀNG" : " THANH TOÁN"}
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
      {invoiceToPrintId && (
        <InHoaDon
          isOpen={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
          hoaDonId={invoiceToPrintId}
        />
      )}
    </>
  );
}

Pay.defaultProps = {
  totalAmount: 0,
};

Pay.propTypes = {
  totalAmount: PropTypes.number,
  hoaDonId: PropTypes.number,
  onSaveOrder: PropTypes.func.isRequired,
  onDataChange: PropTypes.func.isRequired,
  completedOrderId: PropTypes.number,
};

export default Pay;
