import React, { useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import { QRCodeCanvas } from "qrcode.react";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080";
const apiUrl = (path) => `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;

function ProductDetailInfoModal(props) {
    const didShowToast = useRef(false);
    const [images, setImages] = useState([]);
    const [imageDetails, setImageDetails] = useState([]);

    useEffect(() => {
        if (props.open && props.detail?.id) {
            fetch(apiUrl(`/hinhAnh/by-product-detail/${props.detail.id}`))
                .then(res => res.json())
                .then(imgList => {
                    if (Array.isArray(imgList)) {
                        setImages(imgList.filter(img => img.duongDanAnh).map(img => img.duongDanAnh));
                        setImageDetails(imgList); // giữ lại thông tin chi tiết
                    } else {
                        setImages([]);
                        setImageDetails([]);
                    }
                })
                .catch(() => {
                    setImages([]);
                    setImageDetails([]);
                });
        } else {
            setImages([]);
            setImageDetails([]);
        }
    }, [props.open, props.detail?.id]);

    useEffect(() => {
        if (props.open && props.detail && !didShowToast.current) {
            let missingFields = [];
            if (!props.detail.tenThuongHieu) missingFields.push("Thương hiệu");
            if (!props.detail.tenChatLieu) missingFields.push("Chất liệu");
            if (!props.detail.tenCoAo) missingFields.push("Cổ áo");
            if (!props.detail.tenTayAo) missingFields.push("Tay áo");
            if (!props.detail.tenMauSac) missingFields.push("Màu sắc");
            if (!props.detail.tenKichThuoc) missingFields.push("Kích cỡ");
            if (props.detail.gia === undefined || props.detail.gia === null) missingFields.push("Giá");
            if (props.detail.soLuong === undefined || props.detail.soLuong === null) missingFields.push("Số lượng");
            if (props.detail.trongLuong === undefined || props.detail.trongLuong === null) missingFields.push("Trọng lượng");
            if (!props.detail.maSanPhamChiTiet) missingFields.push("Mã sản phẩm chi tiết (QR)");
            if (missingFields.length > 0) {
                toast.error("Thiếu thông tin: " + missingFields.join(", "));
            }
            didShowToast.current = true;
        }
        if (!props.open) {
            didShowToast.current = false;
        }
    }, [props.open, props.detail, images]);

    function handleDownloadQRCode() {
        const canvasElement = document.getElementById("qr-code-info-canvas");
        if (canvasElement) {
            try {
                const imageUrl = canvasElement.toDataURL("image/png");
                const linkElement = document.createElement("a");
                linkElement.href = imageUrl;
                linkElement.download = "ma-qr-san-pham.png";
                linkElement.click();
                toast.success("Tải mã QR thành công!");
            } catch (error) {
                toast.error("Tải mã QR thất bại!");
            }
        } else {
            toast.error("Không tìm thấy mã QR!");
        }
    }

    // Custom label for fields
    const labelStyle = {
        fontWeight: 700,
        color: "#1769aa",
        fontSize: 15,
        letterSpacing: 0.2,
        mb: 0.5,
        display: "block"
    };

    const chipStyle = {
        fontWeight: 700,
        fontSize: 15,
        px: 1.5,
        py: 1,
        letterSpacing: 0.4,
        bgcolor: "#e6f0fb",
        color: "#1976d2",
        borderRadius: 2,
        boxShadow: "0 1px 4px 0 #1976d211",
        mb: 1
    };

    const infoValueStyle = {
        fontWeight: 600,
        fontSize: 16,
        color: "#1976d2",
        bgcolor: "#f7fafd",
        px: 2,
        py: 1,
        borderRadius: 2,
        mb: 1
    };

    // Helper: render chi tiết ảnh
    const renderImageDetail = (img, idx) => (
        <Box key={idx} sx={{ position: "relative", mb: 1.5, mr: 1.5, display: "inline-block" }}>
            <img
                src={img.duongDanAnh}
                alt={img.moTa || `Ảnh sản phẩm ${idx + 1}`}
                width={80}
                height={80}
                style={{
                    borderRadius: 10,
                    border: img.anhMacDinh === 1 ? "2.5px solid #1976d2" : "1.5px solid #b0bec5",
                    objectFit: "cover",
                    background: "#fafbfc",
                    boxShadow: img.anhMacDinh === 1 ? "0 2px 8px #1976d288" : "none",
                    transition: "all 0.25s"
                }}
            />
            {img.anhMacDinh === 1 && (
                <Chip
                    label="Ảnh đại diện"
                    size="small"
                    sx={{
                        position: "absolute",
                        top: 4,
                        left: 4,
                        bgcolor: "#1976d2",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 11,
                        px: 1,
                        py: 0.5,
                        boxShadow: "0 1px 4px #1976d244",
                        borderRadius: 1.5
                    }}
                />
            )}
            <Box sx={{ mt: 0.5 }}>
                <Typography fontSize={12} color="#1976d2" fontWeight={700} sx={{ lineHeight: 1.1 }}>
                    {img.maAnh ? `Mã: ${img.maAnh}` : ""}
                </Typography>
                <Typography fontSize={12} color="#888" sx={{ lineHeight: 1.1 }}>
                    {img.moTa || ""}
                </Typography>
                <Typography fontSize={12} color="#aaa" sx={{ lineHeight: 1.1 }}>
                    {img.trangThai === 1 ? "Đang sử dụng" : "Không sử dụng"}
                </Typography>
            </Box>
        </Box>
    );

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={1800}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <Dialog open={props.open} onClose={props.onClose} maxWidth="md" fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 5,
                            p: 0,
                            bgcolor: "#fafdff",
                            boxShadow: "0 8px 32px 0 #1976d255",
                            overflow: "visible"
                        }
                    }}>
                <Box sx={{ position: "absolute", right: 16, top: 18, zIndex: 1 }}>
                    <IconButton onClick={props.onClose} size="large" sx={{
                        background: "#fff",
                        boxShadow: "0 1px 6px #1976d222",
                        "&:hover": { background: "#f3f6fd" }
                    }}>
                        <CloseIcon fontSize="large" />
                    </IconButton>
                </Box>
                <DialogTitle
                    sx={{
                        fontWeight: 900,
                        fontSize: 32,
                        color: "#1565c0",
                        mb: 2,
                        letterSpacing: 1,
                        textShadow: "0 2px 10px #1976d244"
                    }}
                >
                    Thông tin sản phẩm chi tiết
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={7}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography sx={labelStyle}>Thương hiệu</Typography>
                                    <Chip label={props.detail?.tenThuongHieu || "--"} sx={chipStyle} />
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={labelStyle}>Chất liệu</Typography>
                                    <Chip label={props.detail?.tenChatLieu || "--"} sx={chipStyle} />
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={labelStyle}>Cổ áo</Typography>
                                    <Chip label={props.detail?.tenCoAo || "--"} sx={chipStyle} />
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={labelStyle}>Tay áo</Typography>
                                    <Chip label={props.detail?.tenTayAo || "--"} sx={chipStyle} />
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={labelStyle}>Màu sắc</Typography>
                                    <Chip label={props.detail?.tenMauSac || "--"} sx={chipStyle} />
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={labelStyle}>Kích cỡ</Typography>
                                    <Chip label={props.detail?.tenKichThuoc || "--"} sx={chipStyle} />
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={labelStyle}>Giá (₫)</Typography>
                                    <Box sx={infoValueStyle}>
                                        {props.detail?.gia !== undefined && props.detail?.gia !== null ? props.detail.gia.toLocaleString("vi-VN") + " ₫" : "--"}
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={labelStyle}>Số lượng</Typography>
                                    <Box sx={infoValueStyle}>
                                        {props.detail?.soLuong !== undefined && props.detail?.soLuong !== null ? props.detail.soLuong : "--"}
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={labelStyle}>Trọng lượng (g)</Typography>
                                    <Box sx={infoValueStyle}>
                                        {props.detail?.trongLuong !== undefined && props.detail?.trongLuong !== null ? props.detail.trongLuong : "--"}
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography sx={labelStyle}>Trạng thái</Typography>
                                    <Chip
                                        label={
                                            props.detail?.trangThai === 1 || props.detail?.trangThai === "Đang bán"
                                                ? "Đang bán"
                                                : props.detail?.trangThai === 0 || props.detail?.trangThai === "Ngừng bán"
                                                    ? "Ngừng bán"
                                                    : "--"
                                        }
                                        color={props.detail?.trangThai === 1 || props.detail?.trangThai === "Đang bán" ? "success" : "default"}
                                        sx={{
                                            ...chipStyle,
                                            color: props.detail?.trangThai === 1 || props.detail?.trangThai === "Đang bán" ? "#219653" : "#888",
                                            bgcolor: props.detail?.trangThai === 1 || props.detail?.trangThai === "Đang bán" ? "#e6fbe6" : "#f2f2f2"
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Box sx={{
                                        mt: 2, p: 2, bgcolor: "#f5fafe", borderRadius: 3, boxShadow: "0 1px 4px #1976d211"
                                    }}>
                                        <Typography sx={{ ...labelStyle, color: "#1976d2", fontWeight: 800, fontSize: 17, mb: 1 }}>
                                            Mã QR sản phẩm
                                        </Typography>
                                        <Box display="flex" alignItems="center">
                                            <Box sx={{
                                                p: 1,
                                                bgcolor: "#fff",
                                                borderRadius: 2,
                                                border: "1.5px solid #e3e9f0",
                                                boxShadow: "0 2px 10px #1976d244",
                                                display: "inline-flex"
                                            }}>
                                                <QRCodeCanvas
                                                    id="qr-code-info-canvas"
                                                    value={props.detail?.maSanPhamChiTiet || "QR"}
                                                    size={80}
                                                    level="H"
                                                    includeMargin={false}
                                                    style={{ background: "#fff" }}
                                                />
                                            </Box>
                                            <IconButton color="primary" onClick={handleDownloadQRCode} sx={{
                                                border: "2px solid #1976d2",
                                                bgcolor: "#e3f2fd",
                                                ml: 2,
                                                "&:hover": { bgcolor: "#bbdefb" }
                                            }}>
                                                <DownloadIcon />
                                            </IconButton>
                                        </Box>
                                        <Typography fontSize={13} color="#888" mt={1}>
                                            Mã QR này dùng để quản lý sản phẩm chi tiết.
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <Box sx={{
                                p: 2,
                                bgcolor: "#e9f4fb",
                                borderRadius: 4,
                                minHeight: 290,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                boxShadow: "0 2px 12px #1976d211"
                            }}>
                                <Typography sx={{ ...labelStyle, color: "#1976d2", fontWeight: 800, fontSize: 18, mb: 2 }}>
                                    Hình ảnh sản phẩm
                                </Typography>
                                <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                                    {imageDetails && imageDetails.length > 0 ? (
                                        imageDetails.map((img, idx) => renderImageDetail(img, idx))
                                    ) : (
                                        <Box
                                            sx={{
                                                border: "2px dashed #4acbf2",
                                                borderRadius: 3,
                                                width: 80,
                                                height: 80,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "#bbb",
                                                background: "#f7fbfd"
                                            }}
                                        >
                                            Không có ảnh
                                        </Box>
                                    )}
                                </Box>
                                <Typography fontSize={13} color="#888" mt={2}>
                                    Ảnh đại diện được đánh dấu, các trường thông tin ảnh hiển thị bên dưới mỗi ảnh.
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ pr: 3.5, pb: 2.5, bgcolor: "#fafdff" }}>
                    <Button
                        onClick={props.onClose}
                        variant="contained"
                        sx={{
                            minWidth: 130,
                            fontWeight: 800,
                            fontSize: 20,
                            boxShadow: "0px 4px 18px #1976d244",
                            background: "linear-gradient(90deg,#1976d2 0%,#64b5f6 100%)",
                            color: "#fff",
                            borderRadius: 30,
                            letterSpacing: 1
                        }}
                    >
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

ProductDetailInfoModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    detail: PropTypes.shape({
        id: PropTypes.number,
        tenThuongHieu: PropTypes.string,
        tenChatLieu: PropTypes.string,
        tenCoAo: PropTypes.string,
        tenTayAo: PropTypes.string,
        tenMauSac: PropTypes.string,
        tenKichThuoc: PropTypes.string,
        gia: PropTypes.number,
        soLuong: PropTypes.number,
        trongLuong: PropTypes.number,
        trangThai: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        maSanPhamChiTiet: PropTypes.string
    })
};

export default ProductDetailInfoModal;