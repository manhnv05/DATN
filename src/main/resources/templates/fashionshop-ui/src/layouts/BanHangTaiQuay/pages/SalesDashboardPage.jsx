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

const handleSaveOrder = useCallback(
  async (latestPaymentData) => {
 console.log("Dữ liệu nhận được từ Pay:", latestPaymentData);
    
    // Thêm log mới chỉ để xem ID khách hàng
    console.log("ID Khách hàng nhận được:", latestPaymentData?.customer?.id);

    if (!selectedInvoiceId || !latestPaymentData) {
      alert("Vui lòng kiểm tra lại thông tin hóa đơn và thanh toán.");
      return;
    }

    try {
      // Chuẩn bị các phần chung của payload
      const danhSachSanPham = currentProducts.map((p) => ({
        id: p.idChiTietSanPham,
        soLuong: p.quantity,
      }));
      const phieuGiamGiaId = latestPaymentData.phieuGiamGia ? String(latestPaymentData.phieuGiamGia.id) : null;

      // Khai báo biến payload mà không khởi tạo
      let finalPayload;

      // Xây dựng payload hoàn chỉnh trong từng trường hợp
      if (latestPaymentData.customer && latestPaymentData.customer.id) {
        const { shippingInfo, customer } = latestPaymentData;
        const addressParts = [
          shippingInfo?.detailedAddress,
          shippingInfo?.ward,
          shippingInfo?.province,
        ].filter(Boolean);

        // Tạo payload cho trường hợp CÓ khách hàng
        finalPayload = {
          idHoaDon: selectedInvoiceId,
          phieuGiamGia: phieuGiamGiaId,
          danhSachSanPham: danhSachSanPham,
          phiVanChuyen: latestPaymentData.shippingFee || 0,
          khachHang: customer.id||115,
          tenKhachHang: shippingInfo?.name || customer.tenKhachHang,
          sdt: shippingInfo?.phone || customer.sdt || null,
          diaChi: addressParts.join(", "),
        };

      } else {
        // Tạo payload cho trường hợp KHÁCH LẺ
        finalPayload = {
          idHoaDon: selectedInvoiceId,
          phieuGiamGia: phieuGiamGiaId,
          danhSachSanPham: danhSachSanPham,
          phiVanChuyen: latestPaymentData.shippingFee || 0,
          tenKhachHang: "Khách lẻ",
        };
      }
    
      // In ra "ảnh chụp" chính xác của payload bằng JSON.stringify
      console.log("Gửi payload cuối cùng lên backend:", JSON.stringify(finalPayload, null, 2));
      
      await axios.put("http://localhost:8080/api/hoa-don/update_hoadon", finalPayload);

      alert("Lưu và cập nhật hóa đơn thành công!");
    
    } catch (error) {
      console.error("Đã có lỗi xảy ra:", error);
      alert(`Lỗi: ${error.response?.data?.message || "Lỗi không xác định."}`);
    }
  }, 
  [selectedInvoiceId, currentProducts]
);
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
