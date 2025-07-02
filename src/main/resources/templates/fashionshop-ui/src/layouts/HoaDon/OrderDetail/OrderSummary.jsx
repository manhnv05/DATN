import React from 'react';
import styles from './OrderSummary.module.css';
import PropTypes from 'prop-types';

const OrderSummary = ({ order }) => {
    return (
        <div className={styles['order-summary']}>
            <div className={styles['summary-row']}>
                <p>Phiếu giảm giá:</p>
                <p className={styles.value}>{order.discountCode}</p>
            </div>
            <div className={styles['summary-row']}>
                <p>Giảm giá từ cửa hàng:</p>
                <p className={styles.value}>{order.shopDiscount}</p>
            </div>
            <div className={styles['summary-row']}>
                <p>Tổng tiền hàng:</p>
                <p className={styles.value}>
                    {order.totalItemsPrice.toLocaleString('vi-VN')} VND
                </p>
            </div>
            <div className={styles['summary-row']}>
                <p>Giảm giá:</p>
                <p className={styles.value}>
                    {order.totalDiscount.toLocaleString('vi-VN')} VND
                </p>
            </div>
            <div className={styles['summary-row']}>
                <p>Phí vận chuyển:</p>
                <input
                    type="text"
                    value={order.shippingFee.toLocaleString('vi-VN')}
                    className={styles['shipping-input']}
                    readOnly
                />
            </div>
            <div className={`${styles['summary-row']} ${styles['total-amount']}`}>
                <p>Tổng tiền:</p>
                <p className={styles.value}>
                    {order.totalAmount.toLocaleString('vi-VN')} VND
                </p>
            </div>
        </div>
    );
};
OrderSummary.propTypes = {
    order: PropTypes.shape({
        discountCode: PropTypes.string,
        shopDiscount: PropTypes.number,
        totalItemsPrice: PropTypes.number.isRequired,
        totalDiscount: PropTypes.number,
        shippingFee: PropTypes.number,
        totalAmount: PropTypes.number.isRequired,
    }).isRequired,
};
export default OrderSummary;