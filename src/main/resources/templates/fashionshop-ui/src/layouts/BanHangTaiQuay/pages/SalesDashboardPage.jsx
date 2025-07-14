// src/layouts/sales/SalesDashboardPage.jsx

import React, { useState, useCallback, useMemo } from "react";
// Import các component layout chuẩn
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import SoftBox from "components/SoftBox";
import Grid from "@mui/material/Grid";
import Pay from "../component/Pay"; // Giả sử bạn đã tạo component Pay
import axios from "axios";

import SalesCounter from "../component/SalesCounter";

function SalesDashboardPage() {
  const [currentProducts, setCurrentProducts] = useState([]);
  const [paymentData, setPaymentData] = useState(null);
  const cartTotal = useMemo(() => {
    if (!currentProducts || currentProducts.length === 0) {
      return 0;
    }

    return currentProducts
      .filter((product) => product.isSelected)
      .reduce((total, product) => total + product.gia * product.quantity, 0);
  }, [currentProducts]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  const handleInvoiceIdChange = useCallback((invoiceId) => {
    setSelectedInvoiceId((prevId) => (prevId !== invoiceId ? invoiceId : prevId));
  }, []);

  const handleProductsChange = useCallback((products) => {
    setCurrentProducts(products);
  }, []);

  const handlePaymentDataChange = useCallback((data) => {
    setPaymentData(data);
  }, []);
  // src/layouts/sales/SalesDashboardPage.jsx

const handleSaveOrder = useCallback(async () => {
    if (!selectedInvoiceId || !paymentData) {
        alert("Vui lòng kiểm tra lại thông tin hóa đơn và thanh toán.");
        return;
    }

    try {
        // Gom tất cả dữ liệu vào một payload duy nhất
        const danhSachSanPham = currentProducts.map((p) => ({
            id: p.idChiTietSanPham,
            soLuong: p.quantity,
        }));
        const phieuGiamGiaId = paymentData.phieuGiamGia ? String(paymentData.phieuGiamGia.id) : null;
        
        let payload = {
            idHoaDon: selectedInvoiceId,
            phieuGiamGia: phieuGiamGiaId,
            danhSachSanPham: danhSachSanPham,
            
            phiVanChuyen: paymentData.shippingFee || 0, // Gửi cả phí vận chuyển
        };

        if (paymentData.customer && paymentData.customer.id) {
            const { shippingInfo, customer } = paymentData;
            const addressParts = [
                shippingInfo?.detailedAddress,
                shippingInfo?.ward,
                shippingInfo?.province,
            ].filter(Boolean);
            
            payload = {
                ...payload,
                khachHang: String(customer.id),
                tenKhachHang: shippingInfo?.name || customer.tenKhachHang,
                sdt: shippingInfo?.phone || customer.sdt || null,
                diaChi: addressParts.join(", "),
            };
        } else {
            payload = { ...payload, tenKhachHang: "Khách lẻ" };
        }
      
        // BỎ HOÀN TOÀN LỆNH GỌI API CẬP NHẬT SẢN PHẨM RIÊNG LẺ
        
        console.log("Gửi payload cuối cùng lên backend:", payload);
        await axios.put("http://localhost:8080/api/hoa-don/update_hoadon", payload);

        alert("Lưu và cập nhật hóa đơn thành công!");
      
    } catch (error) {
        console.error("Đã có lỗi xảy ra:", error);
        alert(`Lỗi: ${error.response?.data?.message || "Lỗi không xác định."}`);
    }
}, [selectedInvoiceId, currentProducts, paymentData]);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <SalesCounter
              onProductsChange={handleProductsChange}
              onInvoiceIdChange={handleInvoiceIdChange}
            />
          </Grid>

          <Grid item xs={12}>
            {/* Component SalesCounter được gọi ở đây */}
            <Pay
              totalAmount={cartTotal}
              hoaDonId={selectedInvoiceId}
              onSaveOrder={handleSaveOrder}
              onDataChange={handlePaymentDataChange}
            />
          </Grid>
        </Grid>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default SalesDashboardPage;
