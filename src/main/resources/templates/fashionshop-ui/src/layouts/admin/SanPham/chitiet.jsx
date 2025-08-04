import React, { useState, useEffect, useRef, useCallback } from "react";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import SoftBox from "../../../components/SoftBox";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../examples/Footer";
import Table from "../../../examples/Tables/Table";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { FaQrcode } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaSync } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { FaFileExcel } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ProductDetailUpdateModal from "./modalupdate";
import ProductDetailInfoModal from "./modaldetailproduct";
import { Html5Qrcode } from "html5-qrcode";

function formatPrice(value) {
    if (value !== undefined && value !== null) {
        return value.toLocaleString("vi-VN") + " ₫";
    } else {
        return "";
    }
}

function formatStatus(status) {
    if (status === 1 || status === "Đang bán" || status === "Hiển thị") {
        return "Đang bán";
    } else {
        return "Ngừng bán";
    }
}

const trangThaiList = ["Tất cả", "Đang bán", "Ngừng bán"];
const defaultFilter = {
    trangThai: "Tất cả",
    chatLieu: "Tất cả",
    thuongHieu: "Tất cả",
    coAo: "Tất cả",
    tayAo: "Tất cả",
    mauSac: "Tất cả",
    kichCo: "Tất cả",
    gia: [0, 10000000],
    search: "",
};

function ProductDetailTable() {
    const params = useParams();
    const id = params.id;
    const navigate = useNavigate();

    const [filters, setFilters] = useState({ ...defaultFilter });
    const [filterOptions, setFilterOptions] = useState({
        chatLieu: [],
        thuongHieu: [],
        coAo: [],
        tayAo: [],
        mauSac: [],
        kichCo: [],
    });
    const [giaRange, setGiaRange] = useState([0, 10000000]);
    const [product, setProduct] = useState(null);
    const [details, setDetails] = useState([]);
    const [loading, setLoading] = useState(true);

    const [openUpdateModal, setOpenUpdateModal] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState(null);

    const [qrModalOpen, setQrModalOpen] = useState(false);
    const [qrReady, setQrReady] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [qrError, setQrError] = useState("");
    const qrRef = useRef(null);
    const html5QrCodeRef = useRef(null);

    const [checkedRow, setCheckedRow] = useState(null);
    const [infoModalOpen, setInfoModalOpen] = useState(false);
    const [selectedInfoDetail, setSelectedInfoDetail] = useState(null);

    useEffect(function () {
        setLoading(true);

        async function fetchOptions() {
            try {
                const chatLieuRes = await axios.get("http://localhost:8080/chatLieu/all");
                const thuongHieuRes = await axios.get("http://localhost:8080/thuongHieu/all");
                const coAoRes = await axios.get("http://localhost:8080/coAo/all");
                const tayAoRes = await axios.get("http://localhost:8080/tayAo/all");
                const mauSacRes = await axios.get("http://localhost:8080/mauSac/all");
                const kichCoRes = await axios.get("http://localhost:8080/kichThuoc/all");
                setFilterOptions({
                    chatLieu: chatLieuRes.data || [],
                    thuongHieu: thuongHieuRes.data || [],
                    coAo: coAoRes.data || [],
                    tayAo: tayAoRes.data || [],
                    mauSac: mauSacRes.data || [],
                    kichCo: kichCoRes.data || [],
                });
            } catch (error) {}
        }

        async function fetchProductAndDetails() {
            try {
                const prodRes = await axios.get("http://localhost:8080/sanPham/" + id);
                setProduct(prodRes.data);
                const detailsRes = await axios.get(
                    "http://localhost:8080/chiTietSanPham/by-san-pham/" + id
                );
                setDetails(detailsRes.data || []);
                const giaArr = (detailsRes.data || [])
                    .map(function (d) { return d.gia; })
                    .filter(function (g) { return typeof g === "number"; });
                if (giaArr.length > 0) {
                    setGiaRange([Math.min.apply(null, giaArr), Math.max.apply(null, giaArr)]);
                    setFilters(function (f) {
                        return {
                            ...f,
                            gia: [Math.min.apply(null, giaArr), Math.max.apply(null, giaArr)],
                        };
                    });
                }
            } catch (error) {
                setProduct(null);
                setDetails([]);
            }
            setLoading(false);
        }

        fetchOptions();
        fetchProductAndDetails();
    }, [id]);

    function handleEdit(detail) {
        setSelectedDetail(detail);
        setOpenUpdateModal(true);
    }

    function handleCloseModal() {
        setOpenUpdateModal(false);
        setSelectedDetail(null);
    }

    function handleUpdateDetail(updatedDetail) {
        setOpenUpdateModal(false);
        setSelectedDetail(null);
        setDetails(function (prev) {
            return prev.map(function (item) {
                if (item.maSanPhamChiTiet === updatedDetail.maSanPhamChiTiet) {
                    return { ...item, ...updatedDetail };
                } else {
                    return item;
                }
            });
        });
    }

    useEffect(function () {
        let stopped = false;

        async function cleanupQrCode() {
            if (html5QrCodeRef.current) {
                try {
                    await html5QrCodeRef.current.stop();
                } catch (error) {}
                try {
                    await html5QrCodeRef.current.clear();
                } catch (error) {}
                html5QrCodeRef.current = null;
            }
        }

        if (!qrModalOpen || !qrReady) {
            cleanupQrCode();
            setScanning(false);
            setQrError("");
            return;
        }

        setScanning(true);
        setQrError("");
        if (qrRef.current) {
            html5QrCodeRef.current = new Html5Qrcode(qrRef.current.id);
            html5QrCodeRef.current
                .start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 250 },
                    },
                    async function (decodedText) {
                        if (stopped) return;
                        setScanning(false);
                        await cleanupQrCode();
                        setQrModalOpen(false);
                        try {
                            const res = await axios.get(
                                "http://localhost:8080/chiTietSanPham/find-by-ma?ma=" +
                                encodeURIComponent(decodedText)
                            );
                            if (res.data) {
                                setSelectedInfoDetail(res.data);
                                setInfoModalOpen(true);
                            } else {
                                setQrError("Không tìm thấy sản phẩm với mã: " + decodedText);
                            }
                        } catch (error) {
                            setQrError(
                                "Không tìm thấy sản phẩm với mã: " +
                                decodedText +
                                ". Vui lòng thử lại."
                            );
                        }
                    },
                    function () {}
                )
                .catch(function () {
                    setScanning(false);
                    setQrError("Không thể truy cập camera hoặc camera không khả dụng.");
                });
        }
        return function () {
            stopped = true;
            cleanupQrCode();
        };
    }, [qrModalOpen, qrReady]);

    useEffect(function () {
        if (!qrModalOpen) setQrReady(false);
    }, [qrModalOpen]);

    const handleDialogEntered = useCallback(function () {
        setQrReady(true);
    }, []);

    const filteredDetails = details.filter(function (item) {
        if (
            filters.trangThai !== "Tất cả" &&
            formatStatus(item.trangThai) !== filters.trangThai
        ) {
            return false;
        }
        if (filters.chatLieu !== "Tất cả" && item.tenChatLieu !== filters.chatLieu) {
            return false;
        }
        if (
            filters.thuongHieu !== "Tất cả" &&
            item.tenThuongHieu !== filters.thuongHieu
        ) {
            return false;
        }
        if (filters.coAo !== "Tất cả" && item.tenCoAo !== filters.coAo) {
            return false;
        }
        if (filters.tayAo !== "Tất cả" && item.tenTayAo !== filters.tayAo) {
            return false;
        }
        if (filters.mauSac !== "Tất cả" && item.tenMauSac !== filters.mauSac) {
            return false;
        }
        if (
            filters.kichCo !== "Tất cả" &&
            item.tenKichThuoc !== filters.kichCo
        ) {
            return false;
        }
        if (
            filters.search &&
            !(
                (item.maSanPhamChiTiet &&
                    item.maSanPhamChiTiet
                        .toLowerCase()
                        .includes(filters.search.toLowerCase())) ||
                (item.tenChatLieu &&
                    item.tenChatLieu
                        .toLowerCase()
                        .includes(filters.search.toLowerCase())) ||
                (item.tenThuongHieu &&
                    item.tenThuongHieu
                        .toLowerCase()
                        .includes(filters.search.toLowerCase())) ||
                (item.tenCoAo &&
                    item.tenCoAo
                        .toLowerCase()
                        .includes(filters.search.toLowerCase())) ||
                (item.tenTayAo &&
                    item.tenTayAo
                        .toLowerCase()
                        .includes(filters.search.toLowerCase())) ||
                (item.tenMauSac &&
                    item.tenMauSac
                        .toLowerCase()
                        .includes(filters.search.toLowerCase())) ||
                (item.tenKichThuoc &&
                    item.tenKichThuoc
                        .toLowerCase()
                        .includes(filters.search.toLowerCase()))
            )
        ) {
            return false;
        }
        if (
            Array.isArray(filters.gia) &&
            (item.gia < filters.gia[0] || item.gia > filters.gia[1])
        ) {
            return false;
        }
        return true;
    });

    const rows = filteredDetails.map(function (item, idx) {
        return {
            checkbox: (
                <input
                    type="checkbox"
                    checked={checkedRow === item.maSanPhamChiTiet}
                    onChange={function () {
                        setCheckedRow(
                            checkedRow === item.maSanPhamChiTiet ? null : item.maSanPhamChiTiet
                        );
                    }}
                />
            ),
            stt: idx + 1,
            maSanPhamChiTiet: item.maSanPhamChiTiet,
            chatLieu: item.tenChatLieu || "",
            thuongHieu: item.tenThuongHieu || "",
            coAo: item.tenCoAo || "",
            tayAo: item.tenTayAo || "",
            mauSac: item.tenMauSac || "",
            kichCo: item.tenKichThuoc || "",
            soLuong: item.soLuong,
            trongLuong: item.trongLuong,
            gia: item.gia,
            trangThai: item.trangThai,
            actions: "",
        };
    });

    function renderFilterSelect(key, options, label) {
        return (
            <FormControl fullWidth size="small" sx={{ minWidth: 120 }}>
                <Typography fontSize={13} fontWeight="bold" mb={0.5} color="#324052">
                    {label}
                </Typography>
                <Select
                    value={filters[key]}
                    onChange={function (e) {
                        setFilters(function (f) {
                            return { ...f, [key]: e.target.value };
                        });
                    }}
                    displayEmpty
                    sx={{
                        borderRadius: 2,
                        background: "#f5f6fa",
                        height: 42,
                        fontWeight: 500,
                    }}
                    inputProps={{ "aria-label": key }}
                    MenuProps={{
                        PaperProps: { sx: { borderRadius: 2, mt: 1 } },
                    }}
                >
                    <MenuItem value="Tất cả" sx={{ fontWeight: 500 }}>
                        Tất cả {label.toLowerCase()}
                    </MenuItem>
                    {options.map(function (opt) {
                        return (
                            <MenuItem
                                key={opt.id || opt.value || opt}
                                value={
                                    opt.tenChatLieu ||
                                    opt.tenThuongHieu ||
                                    opt.tenCoAo ||
                                    opt.tenTayAo ||
                                    opt.tenMauSac ||
                                    opt.tenKichThuoc ||
                                    opt
                                }
                                sx={{ fontWeight: 500 }}
                            >
                                {opt.tenChatLieu ||
                                    opt.tenThuongHieu ||
                                    opt.tenCoAo ||
                                    opt.tenTayAo ||
                                    opt.tenMauSac ||
                                    opt.tenKichThuoc ||
                                    opt}
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        );
    }

    const columns = [
        {
            name: "checkbox",
            label: (
                <input type="checkbox" readOnly style={{ pointerEvents: "none" }} />
            ),
            align: "center",
            width: "40px",
        },
        { name: "stt", label: "STT", align: "center", width: "60px" },
        {
            name: "maSanPhamChiTiet",
            label: "Mã sản phẩm",
            align: "left",
            width: "160px",
            render: function (value) {
                return (
                    <Tooltip title={value}>
                        <Typography
                            fontWeight={500}
                            sx={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: 120,
                            }}
                        >
                            {value}
                        </Typography>
                    </Tooltip>
                );
            },
        },
        { name: "chatLieu", label: "Chất liệu", align: "center", width: "110px" },
        {
            name: "thuongHieu",
            label: "Thương hiệu",
            align: "center",
            width: "130px",
        },
        { name: "coAo", label: "Cổ áo", align: "center", width: "100px" },
        { name: "tayAo", label: "Tay áo", align: "center", width: "100px" },
        { name: "mauSac", label: "Màu sắc", align: "center", width: "100px" },
        { name: "kichCo", label: "Kích cỡ", align: "center", width: "80px" },
        { name: "soLuong", label: "Số lượng", align: "center", width: "90px" },
        {
            name: "trongLuong",
            label: "Trọng lượng",
            align: "center",
            width: "100px",
        },
        {
            name: "gia",
            label: "Giá",
            align: "right",
            width: "120px",
            render: function (value) {
                return (
                    <Chip
                        label={formatPrice(value)}
                        color="info"
                        sx={{
                            fontWeight: 700,
                            fontSize: 15,
                            background: "#e3f2fd",
                            borderRadius: 2,
                        }}
                    />
                );
            },
        },
        {
            name: "trangThai",
            label: "Trạng thái",
            align: "center",
            width: "110px",
            render: function (value) {
                return (
                    <Chip
                        label={formatStatus(value)}
                        icon={
                            formatStatus(value) === "Đang bán" ? (
                                <FaCheckCircle style={{ color: "#219653" }} />
                            ) : undefined
                        }
                        sx={{
                            background:
                                formatStatus(value) === "Đang bán" ? "#e6f4ea" : "#f4f6fb",
                            color:
                                formatStatus(value) === "Đang bán"
                                    ? "#219653"
                                    : "#bdbdbd",
                            border:
                                "1px solid " +
                                (formatStatus(value) === "Đang bán"
                                    ? "#219653"
                                    : "#bdbdbd"),
                            fontWeight: 500,
                            borderRadius: 2,
                            fontSize: 14,
                            height: 28,
                        }}
                    />
                );
            },
        },
        {
            name: "actions",
            label: "",
            align: "center",
            width: "120px",
            render: function (_value, row) {
                return (
                    <SoftBox display="flex" gap={0.5} justifyContent="center">
                        <Tooltip title="Sửa">
                            <IconButton
                                size="small"
                                sx={{ color: "#4acbf2" }}
                                onClick={function () {
                                    handleEdit(
                                        details.find(function (d) {
                                            return (
                                                d.maSanPhamChiTiet ===
                                                row.maSanPhamChiTiet
                                            );
                                        })
                                    );
                                }}
                            >
                                <FaEdit />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Thêm mới sản phẩm chi tiết">
                            <IconButton
                                size="small"
                                sx={{ color: "#43e97b" }}
                                onClick={function () {
                                    navigate("/SanPham/ThemMoi");
                                }}
                            >
                                <FaPlus />
                            </IconButton>
                        </Tooltip>
                    </SoftBox>
                );
            },
        },
    ];

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox
                py={3}
                sx={{ background: "#F4F6FB", minHeight: "100vh", userSelect: "none" }}
            >
                <Card sx={{ p: { xs: 2, md: 3 }, mb: 3, borderRadius: 4, boxShadow: 8 }}>
                    <Typography fontWeight="bold" fontSize={22} color="#1976d2" mb={2}>
                        Bộ lọc sản phẩm chi tiết
                    </Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={2}>
                            <Typography
                                fontSize={13}
                                fontWeight="bold"
                                mb={0.5}
                                color="#324052"
                            >
                                Trạng thái
                            </Typography>
                            <FormControl fullWidth size="small" sx={{ minWidth: 120 }}>
                                <Select
                                    value={filters.trangThai}
                                    onChange={function (e) {
                                        setFilters(function (f) {
                                            return {
                                                ...f,
                                                trangThai: e.target.value,
                                            };
                                        });
                                    }}
                                    displayEmpty
                                    sx={{
                                        borderRadius: 2,
                                        background: "#f5f6fa",
                                        height: 42,
                                        fontWeight: 500,
                                    }}
                                    inputProps={{ "aria-label": "trangThai" }}
                                >
                                    {trangThaiList.map(function (s) {
                                        return (
                                            <MenuItem key={s} value={s} sx={{ fontWeight: 500 }}>
                                                {s}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            {renderFilterSelect("chatLieu", filterOptions.chatLieu, "Chất liệu")}
                        </Grid>
                        <Grid item xs={12} md={2}>
                            {renderFilterSelect(
                                "thuongHieu",
                                filterOptions.thuongHieu,
                                "Thương hiệu"
                            )}
                        </Grid>
                        <Grid item xs={12} md={2}>
                            {renderFilterSelect("coAo", filterOptions.coAo, "Cổ áo")}
                        </Grid>
                        <Grid item xs={12} md={2}>
                            {renderFilterSelect("tayAo", filterOptions.tayAo, "Tay áo")}
                        </Grid>
                        <Grid item xs={12} md={2}>
                            {renderFilterSelect("mauSac", filterOptions.mauSac, "Màu sắc")}
                        </Grid>
                        <Grid item xs={12} md={2}>
                            {renderFilterSelect("kichCo", filterOptions.kichCo, "Kích cỡ")}
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <SoftBox pl={2} pr={2}>
                                <Typography fontSize={14} fontWeight="bold" mb={0.5}>
                                    Giá
                                </Typography>
                                <Slider
                                    value={filters.gia}
                                    min={giaRange[0]}
                                    max={giaRange[1]}
                                    step={1000}
                                    onChange={function (_event, value) {
                                        setFilters(function (f) {
                                            return { ...f, gia: value };
                                        });
                                    }}
                                    valueLabelDisplay="auto"
                                    sx={{
                                        color: "#1976d2",
                                        "& .MuiSlider-thumb": { borderRadius: "10px" },
                                    }}
                                />
                                <Box display="flex" justifyContent="space-between" mt={-1}>
                                    <Typography variant="caption" color="text.secondary">
                                        {formatPrice(giaRange[0])}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {formatPrice(giaRange[1])}
                                    </Typography>
                                </Box>
                            </SoftBox>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            md={6}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-end",
                            }}
                        >
                            <SoftBox display="flex" gap={1} alignItems="center" mt={1}>
                                <Button
                                    variant="contained"
                                    color="info"
                                    startIcon={<FaSync />}
                                    sx={{
                                        borderRadius: 3,
                                        fontWeight: 500,
                                        px: 2,
                                        background: "#49a3f1",
                                    }}
                                    onClick={function () {
                                        setFilters({ ...defaultFilter, gia: giaRange });
                                    }}
                                >
                                    Đặt lại
                                </Button>
                                <Button
                                    variant="contained"
                                    color="success"
                                    startIcon={<FaPlus />}
                                    sx={{
                                        borderRadius: 3,
                                        fontWeight: 500,
                                        px: 2,
                                        background: "#43e97b",
                                        color: "#fff",
                                    }}
                                    onClick={function () {
                                        navigate("/SanPham/ThemMoi");
                                    }}
                                >
                                    Thêm
                                </Button>
                                <Tooltip title="Quét mã QR">
                                    <IconButton
                                        sx={{ bgcolor: "#ede7f6", color: "#4acbf2" }}
                                        onClick={function () {
                                            setQrModalOpen(true);
                                        }}
                                    >
                                        <FaQrcode />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Xem nhanh">
                                    <span>
                                        <IconButton
                                            sx={{ bgcolor: "#ede7f6", color: "#4acbf2" }}
                                            onClick={function () {
                                                const row = details.find(function (d) {
                                                    return d.maSanPhamChiTiet === checkedRow;
                                                });
                                                if (row) {
                                                    setSelectedInfoDetail(row);
                                                    setInfoModalOpen(true);
                                                }
                                            }}
                                            disabled={!checkedRow}
                                        >
                                            <FaEye />
                                        </IconButton>
                                    </span>
                                </Tooltip>
                                <Tooltip title="Xuất Excel">
                                    <IconButton sx={{ bgcolor: "#ede7f6", color: "#4acbf2" }}>
                                        <FaFileExcel />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Xuất PDF">
                                    <IconButton sx={{ bgcolor: "#ede7f6", color: "#4acbf2" }}>
                                        <FaFilePdf />
                                    </IconButton>
                                </Tooltip>
                            </SoftBox>
                        </Grid>
                    </Grid>
                </Card>
                <Card sx={{ p: { xs: 2, md: 3 }, mb: 2, borderRadius: 4, boxShadow: 8 }}>
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        mb={2}
                    >
                        <Box>
                            <Typography fontWeight="bold" fontSize={20} color="#1769aa">
                                Danh sách sản phẩm chi tiết{" "}
                                {product ? (
                                    <span style={{ color: "#009688" }}>
                                        - {product.tenSanPham}
                                    </span>
                                ) : (
                                    ""
                                )}
                            </Typography>
                            <Typography color="text.secondary" fontSize={15}>
                                Hiển thị danh sách chi tiết{" "}
                                {product ? product.tenSanPham : ""}
                            </Typography>
                        </Box>
                        <Box>
                            <Chip
                                label={"Tổng: " + rows.length}
                                color="primary"
                                variant="outlined"
                                sx={{ fontWeight: 500, fontSize: 15, height: 32 }}
                            />
                        </Box>
                    </Box>
                    <Table columns={columns} rows={rows} loading={loading} />
                </Card>
                <ProductDetailUpdateModal
                    open={openUpdateModal}
                    onClose={handleCloseModal}
                    onUpdate={handleUpdateDetail}
                    detail={selectedDetail}
                    filterOptions={filterOptions}
                />
                <ProductDetailInfoModal
                    open={infoModalOpen}
                    onClose={function () {
                        setInfoModalOpen(false);
                    }}
                    detail={selectedInfoDetail}
                />
                <Dialog
                    open={qrModalOpen}
                    onClose={function () {
                        setQrModalOpen(false);
                    }}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{ sx: { borderRadius: 4 } }}
                    TransitionProps={{ onEntered: handleDialogEntered }}
                >
                    <DialogTitle sx={{ fontWeight: 700, fontSize: 22, color: "#1976d2" }}>
                        Quét mã QR sản phẩm chi tiết
                    </DialogTitle>
                    <DialogContent>
                        <div
                            id="qr-reader"
                            ref={qrRef}
                            style={{
                                width: "100%",
                                minHeight: 300,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "#f7fafd",
                                borderRadius: 8,
                                marginBottom: 16,
                            }}
                        />
                        {qrError && (
                            <Typography color="error" mt={2} textAlign="center">
                                {qrError}
                            </Typography>
                        )}
                        {scanning && (
                            <Typography color="info" mt={2} textAlign="center">
                                Đang quét mã QR, vui lòng đưa mã vào khung...
                            </Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={function () {
                                setQrModalOpen(false);
                            }}
                            variant="outlined"
                        >
                            Đóng
                        </Button>
                    </DialogActions>
                </Dialog>
            </SoftBox>
            <Footer />
        </DashboardLayout>
    );
}

export default ProductDetailTable;