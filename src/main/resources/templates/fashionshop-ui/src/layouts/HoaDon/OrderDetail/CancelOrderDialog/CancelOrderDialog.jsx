import React, { useState, useEffect } from 'react';
import styles from './CancelOrderDialog.module.css';
import PropTypes from 'prop-types';
import { toast } from "react-toastify";

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
        setSelectedMessage(predefinedMessages[0]);
        setCustomMessage(predefinedMessages[0]);
    }, []);

    const handleRadioChange = (e) => {
        const message = e.target.value;
        setSelectedMessage(message);
        if (message === "Lý do khác: Vui lòng ghi rõ.") {
            setCustomMessage("");
        } else {
            setCustomMessage(message);
        }
    };

    const handleConfirm = () => {
        const finalGhiChu = selectedMessage === "Lý do khác: Vui lòng ghi rõ."
            ? customMessage
            : selectedMessage;

        if (!finalGhiChu.trim()) {
            toast.error("Vui lòng nhập ghi chú hủy đơn hàng.");
            return;
        }

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
                        disabled={selectedMessage !== "Lý do khác: Vui lòng ghi rõ." && selectedMessage !== ""}
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