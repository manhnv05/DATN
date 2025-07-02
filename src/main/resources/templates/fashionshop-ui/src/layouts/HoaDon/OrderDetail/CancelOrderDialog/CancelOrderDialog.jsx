import React, { useState, useEffect } from 'react';
import styles from './CancelOrderDialog.module.css';
import PropTypes from 'prop-types';

const predefinedMessages = [
    "Khách hàng yêu cầu hủy đơn hàng.",
    "Sản phẩm hết hàng, không thể xử lý đơn hàng.",
    "Thông tin đơn hàng không chính xác, liên hệ không được.",
    "Đơn hàng bị trùng lặp, đã hủy bản sao.",
    "Lý do khác: Vui lòng ghi rõ."
];

const CancelOrderDialog = ({ onClose, onConfirmCancel }) => {
    const [selectedMessage, setSelectedMessage] = useState('');
    const [customMessage, setCustomMessage] = useState('');

    useEffect(() => {
        // Đặt mặc định là mẫu tin nhắn đầu tiên khi dialog mở
        setSelectedMessage(predefinedMessages[0]);
        setCustomMessage(predefinedMessages[0]);
    }, []);

    const handleRadioChange = (e) => {
        const message = e.target.value;
        setSelectedMessage(message);
        // Nếu chọn "Lý do khác", cho phép người dùng nhập tùy chỉnh, nếu không thì dùng mẫu
        if (message === "Lý do khác: Vui lòng ghi rõ.") {
            setCustomMessage(""); // Xóa nếu chuyển sang tùy chỉnh
        }
        else{
            setCustomMessage(message)
        }
    };

// Trong file CancelOrderDialog.jsx

    const handleConfirm = () => {
        // >> ĐIỂM DEBUG 1: Kiểm tra xem hàm có được gọi khi nhấn nút không.
        console.log("1. [Dialog] Nút 'Xác nhận' đã được nhấn.");

        const finalGhiChu = selectedMessage === "Lý do khác: Vui lòng ghi rõ."
            ? customMessage
            : selectedMessage;

        console.log("2. [Dialog] Ghi chú cuối cùng (finalGhiChu):", `'${finalGhiChu}'`);

        if (!finalGhiChu.trim()) {

            console.warn("3. [Dialog] Ghi chú rỗng, dừng lại và hiện alert.");
            alert("Vui lòng nhập ghi chú hủy đơn hàng.");
            return;
        }


        console.log("4. [Dialog] Ghi chú hợp lệ. Chuẩn bị gọi onConfirmCancel...");
        onConfirmCancel(finalGhiChu);
    };
    return (
        <div className={styles.dialogOverlay}>
            <div className={styles.dialogContent}>
                <button className={styles.closeButton} onClick={onClose}>X</button>
                <h3 className={styles.dialogTitle}>Nhập ghi chú hủy đơn hàng</h3>

                <div className={styles.radioGroup}>
                    <p className={styles.radioGroupTitle}>Chọn mẫu tin nhắn:</p>
                    {predefinedMessages.map((msg, index) => (
                        <label key={index} className={styles.radioLabel}>
                            <input
                                type="radio"
                                name="cancelReason"
                                value={msg}
                                checked={selectedMessage === msg}
                                onChange={handleRadioChange}
                            />
                            {msg}
                        </label>
                    ))}
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="customNote" className={styles.inputLabel}>Ghi chú hủy:</label>
                    <textarea
                        id="customNote"
                        className={styles.textarea}
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        placeholder="Nhập ghi chú hủy đơn hàng..."
                        rows="4"
                        disabled={selectedMessage !== "Lý do khác: Vui lòng ghi rõ." && selectedMessage !== ""} // Disable nếu không phải "Lý do khác"
                    />
                </div>

                <button className={styles.confirmButton} onClick={handleConfirm}>Xác nhận</button>
            </div>
        </div>
    );
};
CancelOrderDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    onConfirmCancel: PropTypes.func.isRequired,
};
export default CancelOrderDialog;