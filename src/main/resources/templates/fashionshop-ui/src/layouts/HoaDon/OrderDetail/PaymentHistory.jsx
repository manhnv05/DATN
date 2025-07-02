import React from "react";
import styles from "./PaymentHistory.module.css";
import PropTypes from 'prop-types';

const PaymentHistory = ({ payments }) => {
  if (!payments || payments.length === 0) {
    // Truy cập class 'payment-history' dùng styles['payment-history']
    return <div className={styles['payment-history']}>Chưa có lịch sử thanh toán.</div>;
  }

  return (
      <table className="table table-bordered border-2 table rounded-3 ">
        <thead className="table-light">
        <tr>
          <th>#</th>
          <th>Số tiền</th>
          <th>Thời gian</th>
          <th>Mã giao dịch</th>
          <th>Loại giao dịch</th>
          <th>Nhân viên giao dịch</th>
          <th>Nhân viên xác nhận</th>
          <th>Ghi chú</th>
        </tr>
        </thead>
        <tbody>
        {payments.map((payment, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{} </td>
              <td>{}</td>
              <td>{payment.transactionId}</td>
              <td>{payment.type}</td>
              <td>{payment.staff}</td>
              <td>{payment.confirmedBy}</td>
              <td>{payment.note}</td>
            </tr>
        ))}
        </tbody>
      </table>

  );
};
PaymentHistory.propTypes = {
  payments: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number,
        ]).isRequired,
        amount: PropTypes.number.isRequired,
        date: PropTypes.string.isRequired,
        method: PropTypes.string,
      })
  ).isRequired,
};
export default PaymentHistory;