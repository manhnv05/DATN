import React, { useState, useEffect } from 'react';
import styles from './OrderSummary.module.css';
import PropTypes from 'prop-types';

// Component giờ sẽ nhận vào prop `orderId`
const OrderSummary = ({ orderId }) => {
    // State để lưu dữ liệu lấy từ API
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect sẽ được gọi khi component render hoặc khi `orderId` thay đổi
    useEffect(() => {
        if (!orderId) {
            setLoading(false);
            setError("Không có ID hóa đơn để tải dữ liệu.");
            return;
        }

        const fetchOrderSummary = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8080/api/hoa-don/get-thong-tin-hoa-don/${orderId}`);
                if (!response.ok) {
                    throw new Error("Lỗi khi tải dữ liệu hóa đơn.");
                }
                const responseData = await response.json();
                
                // Ánh xạ dữ liệu từ API vào một đối tượng có cấu trúc mà JSX cần
                const formattedData = {
                    discountCode: responseData.data.phieuGiamGia || 'Không có',
                    shopDiscount: 0, // API không có trường này
                    totalItemsPrice: responseData.data.tongTienHang,
                    totalDiscount: responseData.data.giamGia,
                    shippingFee: responseData.data.phiVanChuyen,
                    totalAmount: responseData.data.tongTien,
                };
                
                setOrderData(formattedData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderSummary();
    }, [orderId]); // Dependency array, đảm bảo API được gọi lại nếu orderId thay đổi

    // Xử lý các trạng thái loading và error
    if (loading) {
        return <div className={styles['order-summary']}>Đang tải...</div>;
    }
    if (error) {
        return <div className={styles['order-summary']} style={{color: 'red'}}>{error}</div>;
    }
    if (!orderData) {
        return null; // Không hiển thị gì nếu không có dữ liệu
    }

    // Giao diện không thay đổi, chỉ thay `order` bằng `orderData` từ state
    return (
        <div className={styles['order-summary']}>
            <div className={styles['summary-row']}>
                <p>Phiếu giảm giá:</p>
                <p className={styles.value}>{orderData.discountCode}</p>
            </div>
            {/* <div className={styles['summary-row']}>
                <p>Giảm giá từ cửa hàng:</p>
                <p className={styles.value}>{orderData.shopDiscount}</p>
            </div> */}
            <div className={styles['summary-row']}>
                <p>Tổng tiền hàng:</p>
                <p className={styles.value}>
                    {orderData.totalItemsPrice.toLocaleString('vi-VN')} VND
                </p>
            </div>
            <div className={styles['summary-row']}>
                <p>Giảm giá:</p>
                <p className={styles.value}>
                    {orderData.totalDiscount.toLocaleString('vi-VN')} VND
                </p>
            </div>
            <div className={styles['summary-row']}>
                <p>Phí vận chuyển:</p>
                <input
                    type="text"
                    value={orderData.shippingFee.toLocaleString('vi-VN')}
                    className={styles['shipping-input']}
                    readOnly
                />
            </div>
            <div className={`${styles['summary-row']} ${styles['total-amount']}`}>
                <p>Tổng tiền:</p>
                <p className={styles.value}>
                    {orderData.totalAmount.toLocaleString('vi-VN')} VND
                </p>
            </div>
        </div>
    );
};

// Cập nhật lại PropTypes để nhận `orderId`
OrderSummary.propTypes = {
    orderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default OrderSummary;