import React, { useEffect, useRef, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Html5Qrcode } from "html5-qrcode";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
} from "@mui/material";

function QRCodeScanner({ open, onClose, onScanSuccess, onScanError }) {
    const qrReaderRef = useRef(null);
    const html5QrCodeRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    const [statusMessage, setStatusMessage] = useState("Đang khởi tạo camera...");

    // Hàm dọn dẹp (tắt camera) an toàn hơn
    const cleanup = useCallback(async () => {
        if (html5QrCodeRef.current) {
            try {
                // KIỂM TRA: Chỉ dừng nếu camera đang thực sự quét
                if (html5QrCodeRef.current.isScanning) {
                    await html5QrCodeRef.current.stop();
                }
            } catch (err) {
                console.warn("Lỗi khi dừng camera (có thể bỏ qua):", err);
            }
            html5QrCodeRef.current = null; // Dọn dẹp instance
        }
    }, []);

    useEffect(() => {
        // Nếu modal không mở hoặc chưa sẵn sàng, dọn dẹp và thoát
        if (!open || !isReady) {
            return;
        }

        // Khởi tạo instance mới nếu chưa có
        if (!html5QrCodeRef.current) {
            if (qrReaderRef.current) {
                html5QrCodeRef.current = new Html5Qrcode(qrReaderRef.current.id, false);
            } else {
                return;
            }
        }

        const qrCode = html5QrCodeRef.current;

        const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            rememberLastUsedCamera: true,
        };

        // Hàm xử lý khi quét thành công
        const handleSuccess = (decodedText, _decodedResult) => {
            // CHỈ GỌI callback, không gọi cleanup ở đây nữa
            onScanSuccess(decodedText);
        };

        // Hàm xử lý khi quét lỗi
        const handleError = (errorMessage) => {
            // BỎ QUA LỖI 'NotFoundException' vì nó xuất hiện liên tục
            if (errorMessage.includes("NotFoundException")) {
                return;
            }
            onScanError(errorMessage);
        };

        // Bắt đầu quét
        qrCode.start({ facingMode: "environment" }, config, handleSuccess, handleError)
            .then(() => {
                setStatusMessage("Vui lòng đưa mã QR vào khung quét...");
            })
            .catch((err) => {
                setStatusMessage("Lỗi camera: " + err);
                onScanError("Không thể truy cập camera. Vui lòng cấp quyền và thử lại.");
            });

        // Hàm dọn dẹp sẽ được gọi tự động khi component unmount hoặc `open` thay đổi
        return () => {
            cleanup();
        };
    }, [open, isReady, onScanSuccess, onScanError, cleanup]);

    const handleDialogEntered = useCallback(() => {
        setIsReady(true);
    }, []);

    const handleClose = () => {
        setIsReady(false);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: 4 } }}
            TransitionProps={{ onEntered: handleDialogEntered }}
        >
            <DialogTitle sx={{ fontWeight: 700, fontSize: 22, color: "#1976d2" }}>
                Quét mã QR
            </DialogTitle>
            <DialogContent>
                <div
                    id="qr-reader-container"
                    ref={qrReaderRef}
                    style={{
                        width: "100%",
                        minHeight: 300,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px dashed #ccc",
                        borderRadius: 8,
                        overflow: "hidden",
                    }}
                />
                <Typography color="text.secondary" mt={2} textAlign="center">
                    {statusMessage}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="outlined">
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
}

QRCodeScanner.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onScanSuccess: PropTypes.func.isRequired,
    onScanError: PropTypes.func,
};

QRCodeScanner.defaultProps = {
    onScanError: (error) => console.error("Lỗi máy quét QR:", error),
};

export default QRCodeScanner;