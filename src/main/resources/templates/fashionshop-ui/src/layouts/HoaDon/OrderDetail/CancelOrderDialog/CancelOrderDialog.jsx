import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import các component từ Material-UI
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const predefinedMessages = [
    "Khách hàng yêu cầu hủy đơn hàng.",
    "Sản phẩm hết hàng, không thể xử lý đơn hàng.",
    "Thông tin đơn hàng không chính xác, liên hệ không được.",
    "Đơn hàng bị trùng lặp, đã hủy bản sao.",
    "Lý do khác: Vui lòng ghi rõ."
];

const CancelOrderDialog = ({ isOpen, onClose, onConfirmCancel, isLoading }) => {
    // ---- PHẦN LOGIC BÊN TRONG GIỮ NGUYÊN HOÀN TOÀN ----
    const [selectedMessage, setSelectedMessage] = useState('');
    const [customMessage, setCustomMessage] = useState('');

    useEffect(() => {
        // Reset state khi dialog được mở
        if (isOpen) {
            setSelectedMessage(predefinedMessages[0]);
            setCustomMessage(predefinedMessages[0]);
        }
    }, [isOpen]);

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
    // ---- KẾT THÚC PHẦN LOGIC ----

    // ---- PHẦN GIAO DIỆN ĐƯỢC THAY THẾ BẰNG MUI ----
    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                Nhập ghi chú hủy đơn hàng
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                    disabled={isLoading}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            
            <DialogContent dividers>
                {/* Thay thế radio group bằng các component form của MUI */}
                <FormControl component="fieldset" sx={{ width: '100%', mb: 2 }}>
                    
                    <RadioGroup
                        name="cancelReason"
                        value={selectedMessage}
                        onChange={handleRadioChange}
                    >
                        {predefinedMessages.map((msg) => (
                            <FormControlLabel key={msg} value={msg} control={<Radio />} label={msg} disabled={isLoading} />
                        ))}
                    </RadioGroup>
                </FormControl>

                {/* Thay thế textarea bằng TextField của MUI */}
                <TextField
                    label="Ghi chú hủy"
                    multiline 
                    rows={4}
                    fullWidth
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Nhập ghi chú hủy đơn hàng..."
                    
                    disabled={isLoading || selectedMessage !== "Lý do khác: Vui lòng ghi rõ."}
                />
            </DialogContent>

            {/* Thay thế các nút bấm bằng DialogActions và Button của MUI */}
            <DialogActions>
              
                <Button 
                  onClick={handleConfirm} 
                  variant="outlined" 
                 
                  disabled={isLoading}
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
                >
                    {isLoading ? "Đang xử lý..." : "Xác nhận hủy"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// Cập nhật lại propTypes để bao gồm cả `isOpen` và `isLoading`
CancelOrderDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirmCancel: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
};

// Đặt giá trị mặc định cho prop không bắt buộc
CancelOrderDialog.defaultProps = {
    isLoading: false,
};

export default CancelOrderDialog;