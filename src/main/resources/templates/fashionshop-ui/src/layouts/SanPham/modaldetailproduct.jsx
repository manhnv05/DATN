import React, { useEffect, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import { QRCodeCanvas } from "qrcode.react";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductDetailInfoModal(props) {
    const didShowToast = useRef(false);

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
            if (!props.detail.hinhAnh || !Array.isArray(props.detail.hinhAnh) || props.detail.hinhAnh.length === 0) missingFields.push("Hình ảnh");
            if (!props.detail.maSanPhamChiTiet) missingFields.push("Mã sản phẩm chi tiết (QR)");
            if (missingFields.length > 0) {
                toast.error("Thiếu thông tin: " + missingFields.join(", "));
            }
            didShowToast.current = true;
        }
        if (!props.open) {
            didShowToast.current = false;
        }
    }, [props.open, props.detail]);

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

    const infoBoxStyle = {
        bgcolor: "#f9fafc",
        borderRadius: 3,
        px: 2,
        py: 1,
        mb: 1.5,
        boxShadow: "0 2px 16px 0 #1976d225",
        border: "1px solid #e5eaf1",
        minHeight: 56,
        display: "flex",
        alignItems: "center"
    };

    const labelTextStyle = {
        fontWeight: 700,
        color: "#4a5a7b",
        fontSize: 15,
        mb: 0.5,
        letterSpacing: 0.2
    };

    const chipBoxStyle = {
        fontWeight: 700,
        fontSize: 15,
        px: 1.5,
        py: 1,
        letterSpacing: 0.4,
        bgcolor: "#e6f0fb",
        color: "#1976d2",
        borderRadius: 2,
        boxShadow: "0 1px 4px 0 #1976d211"
    };

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
                            bgcolor: "#f6faff",
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
                        <Grid container item xs={12} spacing={2}>
                            <Grid item xs={6} md={3}>
                                <Box sx={infoBoxStyle}>
                                    <Box>
                                        <Typography sx={labelTextStyle}>Thương hiệu</Typography>
                                        <Chip label={props.detail?.tenThuongHieu || "--"} color="primary" variant="outlined" sx={chipBoxStyle} />
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <Box sx={infoBoxStyle}>
                                    <Box>
                                        <Typography sx={labelTextStyle}>Chất liệu</Typography>
                                        <Chip label={props.detail?.tenChatLieu || "--"} color="primary" variant="outlined" sx={chipBoxStyle} />
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <Box sx={infoBoxStyle}>
                                    <Box>
                                        <Typography sx={labelTextStyle}>Cổ áo</Typography>
                                        <Chip label={props.detail?.tenCoAo || "--"} color="primary" variant="outlined" sx={chipBoxStyle} />
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <Box sx={infoBoxStyle}>
                                    <Box>
                                        <Typography sx={labelTextStyle}>Tay áo</Typography>
                                        <Chip label={props.detail?.tenTayAo || "--"} color="primary" variant="outlined" sx={chipBoxStyle} />
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid container item xs={12} spacing={2}>
                            <Grid item xs={6} md={3}>
                                <Box sx={infoBoxStyle}>
                                    <Box>
                                        <Typography sx={labelTextStyle}>Màu sắc</Typography>
                                        <Chip label={props.detail?.tenMauSac || "--"} color="primary" variant="outlined" sx={chipBoxStyle} />
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <Box sx={infoBoxStyle}>
                                    <Box>
                                        <Typography sx={labelTextStyle}>Kích cỡ</Typography>
                                        <Chip label={props.detail?.tenKichThuoc || "--"} color="primary" variant="outlined" sx={chipBoxStyle} />
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ ...infoBoxStyle, minHeight: 92, flexDirection: "column", alignItems: "flex-start", bgcolor: "#e9f4fb" }}>
                                    <Typography sx={{ ...labelTextStyle, color: "#1976d2", fontSize: 16, fontWeight: 800, mb: 1 }}>
                                        Hình ảnh sản phẩm
                                    </Typography>
                                    <Box display="flex" alignItems="center" gap={2} mt={0.5}>
                                        {props.detail?.hinhAnh && Array.isArray(props.detail.hinhAnh) && props.detail.hinhAnh.length > 0 ? (
                                            <Box display="flex" gap={1}>
                                                {props.detail.hinhAnh.map(function (img, idx) {
                                                    return (
                                                        <Avatar
                                                            key={idx}
                                                            src={typeof img === "string" ? img : URL.createObjectURL(img)}
                                                            variant="rounded"
                                                            sx={{
                                                                width: 56,
                                                                height: 56,
                                                                border: idx === 0 ? "2.5px solid #1976d2" : "1.5px solid #b0bec5",
                                                                boxShadow: idx === 0 ? "0 2px 8px #1976d288" : "none",
                                                                transition: "all 0.25s"
                                                            }}
                                                        />
                                                    );
                                                })}
                                            </Box>
                                        ) : (
                                            <Box
                                                sx={{
                                                    border: "2px dashed #4acbf2",
                                                    borderRadius: 3,
                                                    width: 70,
                                                    height: 70,
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
                                    <Typography fontSize={13} color="#888" mt={1.5}>
                                        Ảnh đầu tiên là ảnh đại diện.
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid container item xs={12} spacing={2} alignItems="center">
                            <Grid item xs={12} md={3}>
                                <Box sx={infoBoxStyle}>
                                    <Box>
                                        <Typography sx={labelTextStyle}>Giá (đ)</Typography>
                                        <Chip label={props.detail?.gia !== undefined && props.detail?.gia !== null ? props.detail.gia.toLocaleString("vi-VN") + " ₫" : "--"} color="info" sx={{ ...chipBoxStyle, color: "#009556", bgcolor: "#e6fbe6" }} />
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Box sx={infoBoxStyle}>
                                    <Box>
                                        <Typography sx={labelTextStyle}>Số lượng</Typography>
                                        <Chip label={props.detail?.soLuong !== undefined && props.detail?.soLuong !== null ? props.detail.soLuong : "--"} color="info" sx={chipBoxStyle} />
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Box sx={infoBoxStyle}>
                                    <Box>
                                        <Typography sx={labelTextStyle}>Trọng lượng (g)</Typography>
                                        <Chip label={props.detail?.trongLuong !== undefined && props.detail?.trongLuong !== null ? props.detail.trongLuong : "--"} color="info" sx={chipBoxStyle} />
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid container item xs={12} spacing={2} alignItems="center" mt={1}>
                            <Grid item xs={12} md={3}>
                                <Box sx={infoBoxStyle}>
                                    <Box>
                                        <Typography sx={labelTextStyle}>Trạng thái</Typography>
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
                                                ...chipBoxStyle,
                                                color: props.detail?.trangThai === 1 || props.detail?.trangThai === "Đang bán" ? "#219653" : "#888",
                                                bgcolor: props.detail?.trangThai === 1 || props.detail?.trangThai === "Đang bán" ? "#e6fbe6" : "#f2f2f2"
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Box sx={{ ...infoBoxStyle, flexDirection: "column", alignItems: "flex-start", minHeight: 110 }}>
                                    <Typography sx={labelTextStyle} mb={1}>
                                        Mã QR
                                    </Typography>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Box
                                            sx={{
                                                border: "2.5px solid #fff",
                                                borderRadius: 2,
                                                p: 0.5,
                                                background: "#fff",
                                                boxShadow: "0 2px 10px #1976d244",
                                                display: "inline-flex",
                                            }}
                                        >
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
                                            ml: 1,
                                            "&:hover": { bgcolor: "#bbdefb" }
                                        }}>
                                            <DownloadIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ pr: 3.5, pb: 2.5, bgcolor: "#f6faff" }}>
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
        tenThuongHieu: PropTypes.string,
        tenChatLieu: PropTypes.string,
        tenCoAo: PropTypes.string,
        tenTayAo: PropTypes.string,
        tenMauSac: PropTypes.string,
        tenKichThuoc: PropTypes.string,
        hinhAnh: PropTypes.array,
        gia: PropTypes.number,
        soLuong: PropTypes.number,
        trongLuong: PropTypes.number,
        trangThai: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        maSanPhamChiTiet: PropTypes.string
    })
};

export default ProductDetailInfoModal;