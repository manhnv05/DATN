// src/layouts/HoaDon/OrderDetailPage/index.jsx

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";

// === IMPORT LAYOUT COMPONENTS ===
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// === IMPORT CÁC COMPONENT TỪ @mui/material VÀ SOFT UI ===
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import SoftButton from "components/SoftButton";

// === IMPORT CÁC COMPONENT CON ===
import OrderHistory from "../OrderDetail/OrderHistory";
import OrderInfo from "../OrderDetail/OrderInfo";
import PaymentHistory from "../OrderDetail/PaymentHistory";
import ProductList from "../OrderDetail/ProductList";
import OrderSummary from "../OrderDetail/OrderSummary";
import OrderHistoryModal from "../OrderHistoryModal/OrderHistoryModal";
import CancelOrderDialog from "../OrderDetail/CancelOrderDialog/CancelOrderDialog";
import UpdateOrderInfo from "../UpdateOrderInfo/UpdateOrderInfo";
import { useReactToPrint } from "react-to-print";

import { toast } from "react-toastify";
import InHoaDon from "../InHoaDon/InHoaDon.jsx";
import PropTypes from "prop-types";

// === Hằng số và hàm Map (đặt bên ngoài component) ===
const statusMap = {
  HOAN_THANH: "Hoàn thành",
  CHO_XAC_NHAN: "Chờ xác nhận",
  DANG_GIAO: "Đang giao",
  HUY: "Đã hủy",
  CHO_THANH_TOAN: "Chờ thanh toán",
  DA_THANH_TOAN: "Đã thanh toán",
  CHO_GIAO_HANG: "Chờ giao hàng",
  DANG_VAN_CHUYEN: "Đang vận chuyển",
  TAO_DON_HANG: "Tạo đơn hàng",
};
const paymentStatusMap = { HOAN_THANH: "Đã thanh toán", CHO_XAC_NHAN: "Chờ thanh toán" };
const orderTypeMap = { tai_quay: "Tại quầy", giao_hang: "Giao hàng", online: "Trực tuyến" };

const mapStatus = (apiStatus) => statusMap[apiStatus] || apiStatus;
const mapPaymentStatus = (apiStatus) => paymentStatusMap[apiStatus] || apiStatus;
const mapOrderType = (apiType) => orderTypeMap[apiType] || apiType;

const OrderDetailPage = () => {
  // === HOOKS VÀ STATE ===
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [nguoiThucHienAction] = useState("Admin");

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const componentRef = useRef();
  const [isCancelling, setIsCancelling] = useState(false);
  // === HÀM XỬ LÝ ===
  const handleShowHistoryModal = () => setShowHistoryModal(true);
  const handleCloseHistoryModal = () => setShowHistoryModal(false);
  const handleOpenUpdateModal = () => setShowUpdateModal(true);
  const handleCloseUpdateModal = () => setShowUpdateModal(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentInvoiceId = orderId;
  const [isCancelModalOpen, setCancelModalOpen] = useState(false);

  const handleOpenCancelModal = () => {
    console.log("HÀM MỞ MODAL ĐÃ ĐƯỢC GỌI!");
    setCancelModalOpen(true);
  };

  const handleCloseCancelModal = () => {
    setCancelModalOpen(false);
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const fetchOrderDetail = useCallback(async () => {
    if (!orderId) {
      setError(new Error("Không tìm thấy ID đơn hàng trong URL."));
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/api/hoa-don/${orderId}`);
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const transformedData = {
        id: data.id,
        maHoaDon: data.maHoaDon,
        customerName: data.tenKhachHang,
        phoneNumber: data.sdt || "N/A",
        type: mapOrderType(data.loaiHoaDon),
        receiverName: data.tenKhachHang,
        status: mapStatus(data.trangThai),
        ngayTao: data.ngayTao,
        diaChi: data.diaChi,
        StaffName: data.tenNhanVien,
        products: (data.danhSachChiTiet || []).map((item) => ({
          id: item.id,
          name: item.tenSanPhamChiTiet || `Sản phẩm ${item.maSanPhamChiTiet}`,
          price: item.gia,
          size: "N/A",
          quantity: item.soLuong,
          imageUrl: item.linkAnh || "/assets/img/logo.jpg",
          maSanPhamChiTiet: item.maSanPhamChiTiet,
        })),
        discountCode: "Không có",
        shopDiscount:
          data.tongGiaGiam && data.tongTienBanDau
            ? `${((data.tongGiaGiam * 100) / data.tongTienBanDau).toFixed(0)}%`
            : "0%",
        shippingFee: data.phiVanChuyen ?? 0,
        totalItemsPrice: data.tongTienBanDau ?? 0,
        totalDiscount: data.tongGiaGiam ?? 0,
        totalAmount: data.tongHoaDon ?? 0,
        payments: (data.lichSuThanhToan || []).map((p) => ({
          method: p.hinhThucThanhToan || "Chưa xác định",
          amount: p.soTienThanhToan,
          date: p.thoiGian ? new Date(p.thoiGian).toLocaleString("vi-VN") : "N/A",
          status: mapPaymentStatus(p.trangThaiThanhToan),
        })),
        trangThaiGoc: data.trangThai,
      };
      setOrderData(transformedData);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);
  const handleConfirmCancellation = async (ghiChuFromDialog) => {
    setIsCancelling(true); // Bật loading
    try {
      const payload = {
        ghiChu: ghiChuFromDialog,
        nguoiThucHien: "Admin",
      };
      const response = await fetch(
        `http://localhost:8080/api/hoa-don/chuyen-trang-thai-huy/${orderId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Lỗi HTTP! Trạng thái: ${response.status}`);
      }

      toast.success("Đơn hàng đã được hủy thành công!");
      await fetchOrderDetail(); // Tải lại dữ liệu trang
    } catch (err) {
      console.error("Lỗi khi hủy đơn hàng:", err);
      toast.error(err.message || "Có lỗi xảy ra khi hủy đơn hàng.");
    } finally {
      setIsCancelling(false); // Tắt loading
      handleCloseCancelModal(); // Đóng dialog
    }
  };
  const handleConfirmStatus = async () => {
      const originalStatus = orderData?.trangThaiGoc;
    setActionLoading(true);
    setActionError(null);
    try {
      const payload = {
        ghiChu: "Chuyển trạng thái tự động",
        nguoiThucHien: nguoiThucHienAction,
      };
      const response = await fetch(
        `http://localhost:8080/api/hoa-don/chuyen-trang-thai-tiep-theo/${orderId}`,
        {
          method: "PUT", // Xác định HTTP method
          headers: {
            "Content-Type": "application/json", // Báo cho server biết body là JSON
          },
          body: JSON.stringify(payload), // Chuyển payload thành chuỗi JSON
        }
      );
      if (!response.ok) {
        // Kiểm tra status code cho fetch
        const errorData = await response
          .json()
          .catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      toast.success("Đã chuyển trạng thái thành công!");
      // 2. KIỂM TRA: Nếu trạng thái gốc là "Chờ xác nhận" thì mở modal in
    if (originalStatus === "CHO_XAC_NHAN") {
      handleOpenModal(); // hoặc setIsModalOpen(true)
    }
      await fetchOrderDetail(); // Tải lại dữ liệu hóa đơn để cập nhật giao diện
    } catch (err) {
      console.error("Lỗi khi chuyển trạng thái tiếp theo:", err);
      setActionError(err.message || "Có lỗi xảy ra khi chuyển trạng thái. Vui lòng thử lại.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleClickCancelButton = () => {
    if (orderData.status === "Hoàn thành" || orderData.status === "Đã hủy") {
    } else {
      setShowCancelDialog(true);
    }
  };

  // === LOGIC DERIVED STATE ===
  const isConfirmButtonDisabled =
    orderData && (orderData.status === "Hoàn thành" || orderData.status === "Đã hủy");
  const isCancelButtonDisabled =
    orderData && (orderData.status === "Hoàn thành" || orderData.status === "Đã hủy");
  const canUpdateInfo =
    orderData && (orderData.status === "Tạo đơn hàng" || orderData.status === "Chờ xác nhận");

  const initialUpdateData = orderData
    ? {
        tenNguoiNhan: orderData.receiverName,
        soDienThoai: orderData.phoneNumber,
        diaChi: orderData.diaChi,
      }
    : {};

  // Hàm xử lý in hóa đơn
  // Trong OrderDetailPage/index.jsx
  const viewPdf = async (orderId) => {
    try {
      const apiUrl = `http://localhost:8080/api/hoa-don/${orderId}/pdf`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("Không thể tải file PDF!");
      }

      // 1. Lấy dữ liệu PDF dưới dạng Blob
      const pdfBlob = await response.blob();

      // 2. Tạo một URL tạm thời cho Blob
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // 3. Mở URL này trong một tab mới
      window.open(pdfUrl);

      // (Tùy chọn nhưng nên có) Thu hồi URL để giải phóng bộ nhớ sau khi tab đã mở
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);
    } catch (error) {
      console.error("Lỗi khi hiển thị PDF:", error);
      // Xử lý lỗi, ví dụ: hiển thị thông báo cho người dùng
    }
  };
  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="calc(100vh - 150px)"
        >
          <CircularProgress color="info" />
          <SoftTypography variant="h5" ml={2}>
            Đang tải chi tiết đơn hàng...
          </SoftTypography>
        </SoftBox>
        <Footer />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox p={3}>
          <Alert severity="error">{error.message}. Không thể tải chi tiết đơn hàng.</Alert>
        </SoftBox>
        <Footer />
      </DashboardLayout>
    );
  }

  if (!orderData) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox p={3}>
          <Alert severity="warning">Không tìm thấy đơn hàng.</Alert>
        </SoftBox>
        <Footer />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox py={3}>
        {actionError && (
          <SoftBox mb={2} px={3}>
            <Alert severity="error">{actionError}</Alert>
          </SoftBox>
        )}

        {/* Phần Lịch sử đơn hàng và các nút hành động */}
        <SoftBox mb={3}>
          <Card>
            <SoftBox p={3}>
              <SoftTypography variant="h5" fontWeight="medium" mb={3} sx={{ color: "#6ea8fe" }}>
                Lịch sử đơn hàng / {orderData.maHoaDon}
              </SoftTypography>

              <OrderHistory orderId={orderData.maHoaDon} />
              <SoftBox display="flex" justifyContent="flex-end" mt={3} gap={1.5}>
                {!isConfirmButtonDisabled && (
                  <SoftButton
                    variant="outlined"
                    size="large"
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
                    onClick={handleConfirmStatus}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      "Xác nhận (Trạng thái tiếp theo)"
                    )}
                  </SoftButton>
                )}
                {!isCancelButtonDisabled && (
                  <SoftButton
                    variant="outlined"
                    color="error"
                    onClick={handleOpenCancelModal}
                    disabled={isCancelButtonDisabled || actionLoading}
                    sx={{
                      textTransform: "none",
                      // Giữ lại logic style cho trạng thái disabled
                      ...(isCancelButtonDisabled && {
                        opacity: 0.5,
                        cursor: "not-allowed",
                      }),
                    }}
                  >
                    {actionLoading && !isConfirmButtonDisabled ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      "Hủy đơn"
                    )}
                  </SoftButton>
                )}
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
                  onClick={setShowHistoryModal}
                >
                  Chi tiết
                </SoftButton>
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
                  onClick={handleOpenModal} // Trigger print function
                  disabled={!canUpdateInfo} // Disable if no data to print
                >
                  In hóa đơn
                </SoftButton>
              </SoftBox>
            </SoftBox>
          </Card>
        </SoftBox>

        {/* Thông tin đơn hàng và nút cập nhật */}
        <SoftBox mb={3}>
          <Card>
            <SoftBox p={3}>
              <SoftTypography variant="h5" fontWeight="medium" mb={3} sx={{ color: "#6ea8fe" }}>
                Thông tin đơn hàng
              </SoftTypography>

              <OrderInfo order={orderData} />
              {canUpdateInfo && (
                <SoftBox display="flex" justifyContent="flex-end" mt={3}>
                  <SoftButton
                    variant="outlined"
                    size="large"
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
                    onClick={handleOpenUpdateModal}
                  >
                    Cập nhật
                  </SoftButton>
                </SoftBox>
              )}
            </SoftBox>
          </Card>
        </SoftBox>

        {/* Lịch sử thanh toán */}
        <SoftBox mb={3}>
          <Card>
            <SoftBox p={3}>
              <SoftTypography variant="h5" fontWeight="medium" mb={3} sx={{ color: "#6ea8fe" }}>
                Lịch sử thanh toán
              </SoftTypography>
              <PaymentHistory payments={orderData.payments} />
            </SoftBox>
          </Card>
        </SoftBox>

        {/* Danh sách sản phẩm */}
        <SoftBox mb={3}>
          <Card>
            <SoftBox p={3}>
              <SoftTypography variant="h5" fontWeight="medium" mb={3} sx={{ color: "#6ea8fe" }}>
                Danh sách sản phẩm
              </SoftTypography>
              <ProductList orderId={orderId} />
            </SoftBox>
          </Card>
        </SoftBox>

        {/* Tổng tiền */}
        <SoftBox mb={3}>
          <Card>
            <SoftBox p={3}>
              <SoftTypography variant="h5" fontWeight="medium" mb={3}>
                Tổng tiền
              </SoftTypography>
              <OrderSummary order={orderData} />
            </SoftBox>
          </Card>
        </SoftBox>

        {/* Modals và Dialogs */}
        {showHistoryModal && orderData && (
          <OrderHistoryModal maHoaDon={orderData.maHoaDon} onClose={handleCloseHistoryModal} />
        )}
      
          <CancelOrderDialog
            isOpen={isCancelModalOpen}
            onClose={handleCloseCancelModal}
            onConfirmCancel={handleConfirmCancellation}
            isLoading={isCancelling}
          />
        
        {showUpdateModal && orderData && (
          <UpdateOrderInfo
            show={showUpdateModal}
            onClose={handleCloseUpdateModal}
            orderId={orderData.id}
            initialData={initialUpdateData}
            onUpdateSuccess={fetchOrderDetail}
          />
        )}

        <InHoaDon isOpen={isModalOpen} onClose={handleCloseModal} hoaDonId={currentInvoiceId} />

        <div style={{ display: "none" }}>
          {orderData && <InHoaDon ref={componentRef} orderData={orderData} />}
        </div>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
};
CancelOrderDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirmCancel: PropTypes.func.isRequired,
  isLoading: PropTypes.bool, // Thêm dòng này
};
export default OrderDetailPage;
