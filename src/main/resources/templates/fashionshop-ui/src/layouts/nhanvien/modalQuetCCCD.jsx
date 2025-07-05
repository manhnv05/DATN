import PropTypes from "prop-types";
import React, { useRef, useState, useEffect, useCallback } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

/**
 * Modal camera/chọn file cho quét CCCD, trả ra File object hoặc Blob (không trả base64)
 * @param {boolean} open
 * @param {function} onClose
 * @param {function} onCapture nhận File hoặc Blob (dùng để upload form-data)
 */
export default function CCCDCameraModal({ open, onClose, onCapture }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [captured, setCaptured] = useState(null);

    const stopCamera = useCallback(() => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
            videoRef.current.srcObject = null;
        }
        setStream(null);
    }, []);

    useEffect(() => {
        if (open && !captured) {
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then((curStream) => {
                    setStream(curStream);
                    if (videoRef.current) {
                        videoRef.current.srcObject = curStream;
                    }
                })
                .catch((err) => {
                    alert("Không thể truy cập camera: " + err.message);
                });
        }
        return () => {
            stopCamera();
        };
    }, [open, captured, stopCamera]);

    const handleCapture = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
                if (blob) {
                    setCaptured(URL.createObjectURL(blob));
                    canvas.currentBlob = blob;
                }
            }, "image/png");
            stopCamera();
        }
    };

    const handleUsePhoto = () => {
        if (canvasRef.current && canvasRef.current.currentBlob) {
            onCapture(new File([canvasRef.current.currentBlob], "cccd.png", { type: "image/png" }));
            handleClose();
        } else if (captured && captured.fileObj) {
            onCapture(captured.fileObj);
            handleClose();
        }
    };

    const handleRetake = () => {
        setCaptured(null);
        if (canvasRef.current) canvasRef.current.currentBlob = null;
    };

    const handleClose = () => {
        stopCamera();
        setCaptured(null);
        if (canvasRef.current) canvasRef.current.currentBlob = null;
        onClose();
    };

    const handleChooseFile = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setCaptured({
                url: URL.createObjectURL(file),
                fileObj: file
            });
            stopCamera();
        }
    };

    const getPreviewUrl = () => {
        if (!captured) return null;
        if (typeof captured === "string") return captured;
        if (typeof captured === "object" && captured.url) return captured.url;
        return null;
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    width: 400,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    borderRadius: 2,
                    p: 3,
                    mx: "auto",
                    my: "10vh",
                    outline: "none",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                <Typography variant="h6" fontWeight={700} mb={1}>
                    Quét CCCD (Camera)
                </Typography>
                {!captured ? (
                    <>
                        <video
                            ref={videoRef}
                            style={{ width: "100%", borderRadius: 8 }}
                            autoPlay
                            playsInline
                        />
                        <Button
                            variant="contained"
                            color="info"
                            onClick={handleCapture}
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            Chụp ảnh
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={handleChooseFile}
                            fullWidth
                            sx={{ mt: 1 }}
                        >
                            Chọn ảnh từ máy
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleClose}
                            fullWidth
                            sx={{ mt: 1 }}
                        >
                            Hủy
                        </Button>
                    </>
                ) : (
                    <>
                        <img
                            src={getPreviewUrl()}
                            alt="CCCD captured"
                            style={{ width: "100%", borderRadius: 8 }}
                        />
                        <Box display="flex" gap={1} width="100%" mt={1}>
                            <Button
                                variant="contained"
                                color="success"
                                fullWidth
                                onClick={handleUsePhoto}
                            >
                                Dùng ảnh này
                            </Button>
                            <Button
                                variant="outlined"
                                color="info"
                                fullWidth
                                onClick={handleRetake}
                            >
                                Chụp lại
                            </Button>
                        </Box>
                    </>
                )}
                <canvas ref={canvasRef} style={{ display: "none" }} />
            </Box>
        </Modal>
    );
}

CCCDCameraModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onCapture: PropTypes.func.isRequired,
};