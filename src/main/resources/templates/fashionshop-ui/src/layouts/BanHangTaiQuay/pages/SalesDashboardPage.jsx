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
    const [paymentData, setPaymentData] = useState(null)
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
   const handleSaveOrder = useCallback(async () => {
    // ---- KIỂM TRA ĐIỀU KIỆN ----
    if (!selectedInvoiceId) {
      alert("Chưa có hóa đơn nào được chọn.");
      return;
    }
    if (!paymentData) {
      alert("Chưa có dữ liệu khách hàng và thanh toán.");
      return;
    }

    try {
      // ---- CÔNG VIỆC 1: LƯU DANH SÁCH SẢN PHẨM ----
      if (currentProducts && currentProducts.length > 0) {
        const danhSachCapNhat = currentProducts.map((p) => ({
          id: p.idChiTietSanPham,
          soLuong: p.quantity,
        }));
        await axios.post(
          `http://localhost:8080/api/hoa-don/cap-nhat-danh-sach-san-pham/${selectedInvoiceId}`,
          danhSachCapNhat
        );
        console.log("Lưu danh sách sản phẩm thành công!");
      }

      // ---- CÔNG VIỆC 2: CẬP NHẬT THÔNG TIN HÓA ĐƠN ----
      let payload = {
        idHoaDon: selectedInvoiceId,
        tongTien: cartTotal,
      };

      if (paymentData.customer && paymentData.customer.id) {
        const { shippingInfo, customer } = paymentData;
       // 1. Ghép chuỗi địa chỉ một cách an toàn, chỉ lấy các phần có dữ liệu
        const addressParts = [
          shippingInfo?.detailedAddress,
          shippingInfo?.ward,
          shippingInfo?.province,
        ].filter(Boolean); // filter(Boolean) sẽ loại bỏ các chuỗi rỗng, null, undefined

        const fullAddress = addressParts.join(", ");

        payload = {
          ...payload,
          khachHang: String(customer.id),
          // 2. Ưu tiên lấy tên và SĐT từ form, nếu không có thì lấy từ thông tin khách hàng đã chọn
          tenKhachHang: shippingInfo?.name || customer.tenKhachHang,
          sdt: shippingInfo?.phone || customer.sdt || null, // Lấy SĐT từ form, nếu không có thì lấy SĐT mặc định của khách
          diaChi: fullAddress, // Địa chỉ đã được ghép nối an toàn
        };
      } else {
        payload = {
          ...payload,
          tenKhachHang: "Khách lẻ",
        };
      }
 console.log("Chuẩn bị gửi lên API cập nhật hóa đơn:", payload);
      await axios.put("http://localhost:8080/api/hoa-don/update_hoadon", payload);

      alert("Lưu và cập nhật hóa đơn thành công!");
      // Có thể reset state hoặc chuyển trang ở đây

    } catch (error) {
      console.error("Đã có lỗi xảy ra:", error);
      alert(`Lỗi: ${error.response?.data?.message || "Lỗi không xác định."}`);
    }
  }, [selectedInvoiceId, currentProducts, paymentData, cartTotal]);
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
