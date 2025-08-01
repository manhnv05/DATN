import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "@mui/material/Input";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import SoftBox from "components/SoftBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Icon from "@mui/material/Icon";
import Table from "examples/Tables/Table";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEye, FaTrash } from "react-icons/fa";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import DialogContentText from "@mui/material/DialogContentText";
import Avatar from "@mui/material/Avatar";
import dayjs from "dayjs";

const genderList = ["Tất cả", "Nam", "Nữ", "Khác"];
const statusList = ["Tất cả", "Online", "Offline"];
const viewOptions = [5, 10, 20];

function getGenderText(gender) {
    if (gender === "Nam" || gender === 1) {
        return "Nam";
    }
    if (gender === "Nữ" || gender === 0) {
        return "Nữ";
    }
    return "Khác";
}

function getStatusText(status) {
    if (status === 1 || status === "Online") {
        return "Online";
    }
    return "Offline";
}

function getPaginationItems(current, total) {
    if (total <= 4) {
        return Array.from({ length: total }, (_, i) => i);
    }
    if (current <= 1) {
        return [0, 1, "...", total - 2, total - 1];
    }
    if (current >= total - 2) {
        return [0, 1, "...", total - 2, total - 1];
    }
    return [0, 1, "...", current, "...", total - 2, total - 1];
}

function CustomerTable() {
    const [customersData, setCustomersData] = useState({
        content: [],
        totalPages: 0,
        number: 0,
        first: true,
        last: true,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [genderFilter, setGenderFilter] = useState("Tất cả");
    const [statusFilter, setStatusFilter] = useState("Tất cả");
    const [viewCount, setViewCount] = useState(5);
    const [page, setPage] = useState(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingCustomer, setDeletingCustomer] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "info",
    });
    const navigate = useNavigate();

    async function fetchCustomers() {
        setLoading(true);
        setError(null);
        try {
            // Build params as KhachHangQueryVO for Spring controller
            let params = {
                page: page,
                size: viewCount,
                tenKhachHang: search,
            };
            if (genderFilter !== "Tất cả") {
                params.gioiTinh = genderFilter;
            }
            if (statusFilter !== "Tất cả") {
                params.trangThai = statusFilter === "Online" ? 1 : 0;
            }
            const response = await axios.get("http://localhost:8080/khachHang", { params });
            setCustomersData({
                ...response.data,
                content: response.data.content || [],
            });
        } catch (error) {
            setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
            setCustomersData({
                content: [],
                totalPages: 0,
                number: 0,
                first: true,
                last: true,
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCustomers();
        // eslint-disable-next-line
    }, [search, genderFilter, statusFilter, viewCount, page]);

    function handlePageChange(newPage) {
        if (
            typeof newPage === "number" &&
            newPage >= 0 &&
            newPage < customersData.totalPages &&
            newPage !== page
        ) {
            setPage(newPage);
        }
    }

    function handleSearchChange(event) {
        setSearch(event.target.value);
        setPage(0);
    }

    function handleGenderFilterChange(event) {
        setGenderFilter(event.target.value);
        setPage(0);
    }

    function handleStatusFilterChange(event) {
        setStatusFilter(event.target.value);
        setPage(0);
    }

    function handleViewCountChange(event) {
        setViewCount(Number(event.target.value));
        setPage(0);
    }

    function handleDeleteOpen(customer) {
        setDeletingCustomer(customer);
        setDeleteDialogOpen(true);
    }

    function handleDeleteClose() {
        setDeleteDialogOpen(false);
        setDeletingCustomer(null);
    }

    async function handleDeleteConfirm() {
        if (!deletingCustomer) return;
        setDeleteLoading(true);
        try {
            await axios.delete(`http://localhost:8080/khachHang/${deletingCustomer.id}`);
            handleDeleteClose();
            setNotification({
                open: true,
                message: "Xóa khách hàng thành công!",
                severity: "success",
            });
            fetchCustomers();
        } catch (error) {
            setNotification({
                open: true,
                message: "Xóa khách hàng thất bại!",
                severity: "error",
            });
        } finally {
            setDeleteLoading(false);
        }
    }

    const columns = [
        { name: "stt", label: "STT", align: "center", width: "60px" },
        {
            name: "maKhachHang",
            label: "Mã KH",
            align: "left",
            width: "90px",
        },
        {
            name: "tenKhachHang",
            label: "Khách hàng",
            align: "left",
            width: "200px",
            render: function (value, row) {
                return (
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <Avatar src={row.anh || "/default-avatar.png"} alt={value} />
                        <span>{value}</span>
                    </Box>
                );
            },
        },
        {
            name: "email",
            label: "Email",
            align: "left",
            width: "170px",
        },
        {
            name: "ngaySinh",
            label: "Ngày sinh",
            align: "center",
            width: "120px",
            render: function (value) { return value ? dayjs(value).format("DD/MM/YYYY") : ""; },
        },
        {
            name: "gioiTinh",
            label: "Giới tính",
            align: "center",
            width: "90px",
            render: function (value) { return getGenderText(value); },
        },
        {
            name: "trangThai",
            label: "Trạng thái",
            align: "center",
            width: "110px",
            render: function (value) {
                return (
                    <span
                        style={{
                            background: getStatusText(value) === "Online" ? "#e6f4ea" : "#f4f6fb",
                            color: getStatusText(value) === "Online" ? "#219653" : "#bdbdbd",
                            border: "1px solid " + (getStatusText(value) === "Online" ? "#219653" : "#bdbdbd"),
                            borderRadius: 6,
                            fontWeight: 500,
                            padding: "2px 12px",
                            fontSize: 13,
                            display: "inline-block",
                        }}
                    >
                        {getStatusText(value)}
                    </span>
                );
            },
        },
        {
            name: "actions",
            label: "Thao tác",
            align: "center",
            width: "110px",
            render: function (_, row) {
                return (
                    <SoftBox display="flex" gap={0.5} justifyContent="center">
                        <IconButton
                            size="small"
                            sx={{ color: "#4acbf2" }}
                            title="Chi tiết"
                            onClick={function () { navigate("/KhachHang/ChiTiet/" + row.id); }}
                        >
                            <FaEye />
                        </IconButton>
                        {/**/}
                        <IconButton
                            size="small"
                            sx={{ color: "#e74c3c" }}
                            title="Xóa"
                            onClick={function () { handleDeleteOpen(row); }}
                        >
                            <FaTrash />
                        </IconButton>
                    </SoftBox>
                );
            },
        },
    ];

    const rows = customersData.content.map(function (item, idx) {
        return {
            stt: page * viewCount + idx + 1,
            id: item.id,
            maKhachHang: item.maKhachHang,
            tenKhachHang: item.tenKhachHang,
            email: item.email,
            ngaySinh: item.ngaySinh,
            gioiTinh: item.gioiTinh,
            trangThai: item.trangThai,
            anh: item.anh,
            actions: "",
        };
    });

    const paginationItems = getPaginationItems(customersData.number, customersData.totalPages);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox py={3} sx={{ background: "#F4F6FB", minHeight: "100vh", userSelect: "none" }}>
                <Card sx={{ padding: { xs: 2, md: 3 }, marginBottom: 2 }}>
                    <SoftBox
                        display="flex"
                        flexDirection={{ xs: "column", md: "row" }}
                        alignItems="center"
                        justifyContent="space-between"
                        gap={2}
                    >
                        <SoftBox flex={1} display="flex" alignItems="center" gap={2} maxWidth={600}>
                            <Input
                                fullWidth
                                placeholder="Tìm kiếm khách hàng"
                                value={search}
                                onChange={handleSearchChange}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Icon fontSize="small" sx={{ color: "#868686" }}>
                                            search
                                        </Icon>
                                    </InputAdornment>
                                }
                                sx={{ background: "#f5f6fa", borderRadius: 2, padding: 0.5, color: "#222" }}
                            />
                            <FormControl sx={{ minWidth: 120 }}>
                                <Select
                                    value={genderFilter}
                                    onChange={handleGenderFilterChange}
                                    size="small"
                                    displayEmpty
                                    sx={{ borderRadius: 2, background: "#f5f6fa", height: 40 }}
                                    inputProps={{ "aria-label": "Giới tính" }}
                                >
                                    {genderList.map(function (g) {
                                        return (
                                            <MenuItem key={g} value={g}>
                                                {g}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                            <FormControl sx={{ minWidth: 120 }}>
                                <Select
                                    value={statusFilter}
                                    onChange={handleStatusFilterChange}
                                    size="small"
                                    displayEmpty
                                    sx={{ borderRadius: 2, background: "#f5f6fa", height: 40 }}
                                    inputProps={{ "aria-label": "Trạng thái" }}
                                >
                                    {statusList.map(function (s) {
                                        return (
                                            <MenuItem key={s} value={s}>
                                                {s}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </SoftBox>
                        <SoftBox display="flex" alignItems="center" gap={1}>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<FaPlus />}
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
                                onClick={function () { navigate("/khachhang/add"); }}
                            >
                                Thêm khách hàng
                            </Button>
                        </SoftBox>
                    </SoftBox>
                </Card>
                <Card sx={{ padding: { xs: 2, md: 3 }, marginBottom: 2 }}>
                    <SoftBox>
                        {error ? (
                            <div className="alert alert-danger">{error}</div>
                        ) : (
                            <Table columns={columns} rows={rows} loading={loading} />
                        )}
                    </SoftBox>
                    <SoftBox
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        marginTop={2}
                        flexWrap="wrap"
                        gap={2}
                    >
                        <SoftBox>
                            <FormControl sx={{ minWidth: 120 }}>
                                <Select
                                    value={viewCount}
                                    onChange={handleViewCountChange}
                                    size="small"
                                >
                                    {viewOptions.map(function (number) {
                                        return (
                                            <MenuItem key={number} value={number}>
                                                Xem {number}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </SoftBox>
                        <SoftBox display="flex" alignItems="center" gap={1}>
                            <Button
                                variant="text"
                                size="small"
                                disabled={customersData.first}
                                onClick={function () { handlePageChange(page - 1); }}
                                sx={{ color: customersData.first ? "#bdbdbd" : "#49a3f1" }}
                            >
                                Trước
                            </Button>
                            {paginationItems.map(function (item, idx) {
                                if (item === "...") {
                                    return (
                                        <Button
                                            key={"ellipsis-" + idx}
                                            variant="text"
                                            size="small"
                                            disabled
                                            sx={{
                                                minWidth: 32,
                                                borderRadius: 2,
                                                color: "#bdbdbd",
                                                pointerEvents: "none",
                                                fontWeight: 700,
                                            }}
                                        >
                                            ...
                                        </Button>
                                    );
                                }
                                return (
                                    <Button
                                        key={item}
                                        variant={customersData.number === item ? "contained" : "text"}
                                        color={customersData.number === item ? "info" : "inherit"}
                                        size="small"
                                        onClick={function () { handlePageChange(item); }}
                                        sx={{
                                            minWidth: 32,
                                            borderRadius: 2,
                                            color: customersData.number === item ? "#fff" : "#495057",
                                            background: customersData.number === item ? "#49a3f1" : "transparent",
                                        }}
                                    >
                                        {item + 1}
                                    </Button>
                                );
                            })}
                            <Button
                                variant="text"
                                size="small"
                                disabled={customersData.last}
                                onClick={function () { handlePageChange(page + 1); }}
                                sx={{ color: customersData.last ? "#bdbdbd" : "#49a3f1" }}
                            >
                                Sau
                            </Button>
                        </SoftBox>
                    </SoftBox>
                </Card>
            </SoftBox>
            {/**/}
            <Dialog open={deleteDialogOpen} onClose={handleDeleteClose} maxWidth="xs" fullWidth>
                <DialogTitle fontWeight={800} color="#e74c3c" sx={{ fontSize: 22 }}>
                    Xác nhận xóa khách hàng
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn xóa khách hàng <strong>{deletingCustomer && deletingCustomer.tenKhachHang}</strong> không? Thao tác này không thể hoàn tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ padding: 2 }}>
                    <Button onClick={handleDeleteClose} disabled={deleteLoading} variant="outlined" color="inherit" sx={{ borderRadius: 2, fontWeight: 600 }}>
                        Hủy
                    </Button>
                    <Button onClick={handleDeleteConfirm} disabled={deleteLoading} variant="contained" color="error" sx={{ borderRadius: 2, minWidth: 110, fontWeight: 700 }} startIcon={deleteLoading ? <CircularProgress size={18} color="inherit" /> : null}>
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
            <Footer />
        </DashboardLayout>
    );
}

export default CustomerTable;