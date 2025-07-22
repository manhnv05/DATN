import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./PaymentHistory.module.css"; // File CSS module của bạn

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

// --- Component chính ---
const PaymentHistory = ({ orderId }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    const fetchPaymentHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:8080/chiTietThanhToan/lich-su-thanh-toan/${orderId}`
        );
       if (!response.ok) throw new Error(`Chưa có lịch sử thanh toán`);
        
        const result = await response.json();
        if (result && result.code === 1000 && Array.isArray(result.data)) {
          setPayments(result.data);
        } else {
          throw new Error("Dữ liệu trả về không hợp lệ.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentHistory();
  }, [orderId]);

  // Hàm helper lấy class cho badge, theo đúng mẫu bạn cung cấp
  const getPaymentMethodBadgeClassName = (method) => {
    const normalizedMethod = method ? method.trim().toLowerCase() : "";
    if (normalizedMethod === "tiền mặt") {
      return 'bg-success'; // Trả về tên class giống mẫu của bạn
    }
    if (normalizedMethod === "chuyển khoản") {
      return 'bg-primary'; // Trả về tên class giống mẫu của bạn
    }
    return 'bg-success'; // Mặc định
  };

  if (loading) return <div>Đang tải lịch sử thanh toán...</div>;
  if (error) return <div className="text-danger">Lỗi khi tải dữ liệu: {error}</div>;
  
  return (
    <div className="card">
     
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
    </div>
  );
};

PaymentHistory.propTypes = {
  orderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default PaymentHistory;