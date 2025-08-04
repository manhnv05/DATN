import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./PaymentHistory.module.css"; // File CSS module của bạn
import PaymentModalOrderDetail from "./PaymentModalOrderDetail ";
// --- Các hàm tiện ích (giữ nguyên) ---
const formatCurrency = (amount) => {
  if (typeof amount !== "number") return "";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const formatDateTime = (isoString) => {
  if (!isoString) return "N/A";
  return new Date(isoString).toLocaleString("vi-VN");
};

const PaymentHistory = ({ orderId }) => {
  const [payments, setPayments] = useState([]);
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Fetch lịch sử thanh toán
      const paymentResponse = await fetch(
          `http://localhost:8080/chiTietThanhToan/lich-su-thanh-toan/${orderId}`
      );
      if (paymentResponse.ok) {
        const paymentResult = await paymentResponse.json();
        setPayments(paymentResult?.data || []);
      } else {
        setPayments([]);
      }

      // Fetch thông tin hóa đơn
      const orderResponse = await fetch(`http://localhost:8080/api/hoa-don/${orderId}`);
      if (!orderResponse.ok) throw new Error('Không thể tải thông tin hóa đơn.');

      const orderResult = await orderResponse.json();
      setOrderInfo(orderResult);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [orderId]);

  const handlePaymentSuccess = () => {
    fetchData();
  };

  const getPaymentMethodBadgeClassName = (method) => {
    const normalizedMethod = method ? method.trim().toLowerCase() : "";
    if (normalizedMethod === "tiền mặt") return 'bg-success';
    if (normalizedMethod === "chuyển khoản") return 'bg-primary';
    return 'bg-success';
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div className="text-danger">Lỗi khi tải dữ liệu: {error}</div>;

  const amountToPay = orderInfo?.tongHoaDon || 0;


  return (
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">

          {/* ĐIỀU KIỆN KIỂM TRA ĐÚNG */}
          {orderInfo && orderInfo.trangThai === 'DANG_VAN_CHUYEN' && amountToPay > 0 && (
              <button className={styles.paymentButton} onClick={() => setIsModalOpen(true)}>
                Thanh toán
              </button>
          )}
        </div>
        <div className="card-body">
          {payments.length === 0 ? (
              <p>Chưa có lịch sử thanh toán cho hóa đơn này.</p>
          ) : (
              payments.map((payment, index) => (
                  // Mỗi lần thanh toán là một khối riêng
                  <div key={index} className={styles.paymentRecord}>
                    <div className="row">
                      <div className="col-md-6 mb-2">
                        <strong>Số tiền:</strong>
                        <span className={styles.currency}>
                    {formatCurrency(payment.soTienThanhToan)}
                  </span>
                      </div>
                      <div className="col-md-6 mb-2">
                        <strong>Thời gian:</strong> {formatDateTime(payment.thoiGianThanhToan)}
                      </div>
                      <div className="col-md-6 mb-2">
                        <strong>Hình thức:</strong>
                        <span className={`${styles.softBadge} ${styles[getPaymentMethodBadgeClassName(payment.tenHinhThucThanhToan)]}`}>
                     {payment.tenHinhThucThanhToan || '—'}
                  </span>
                      </div>
                      <div className="col-md-6 mb-2">
                        <strong>Mã giao dịch:</strong> {payment.maGiaoDich || "—"}
                      </div>
                      <div className="col-md-6 mb-2">
                        <strong>Nhân viên xác nhận:</strong> {payment.nhanVienXacNhan || "—"}
                      </div>
                      <div className="col-md-6 mb-2">
                        <strong>Ghi chú:</strong> {payment.ghiChu || "—"}
                      </div>
                    </div>
                    {/* Thêm đường kẻ ngang nếu có nhiều hơn 1 lần thanh toán */}
                    {index < payments.length - 1 && <hr className="my-3" />}
                  </div>
              ))
          )}
        </div>
        {/* Render Modal MUI đã đổi tên */}
        {orderInfo && (
            <PaymentModalOrderDetail
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handlePaymentSuccess}
                orderId={orderId}
                totalAmount={amountToPay}
            />
        )}
      </div>

  );
};

PaymentHistory.propTypes = {
  orderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default PaymentHistory;