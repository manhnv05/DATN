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
import { FaPlus, FaEye, FaEdit, FaFileExcel, FaFilePdf } from "react-icons/fa";
import axios from "axios";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Notifications from "layouts/Notifications";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import NhanVienDetail from "./detail"; // <-- import detail component

const genderOptions = ["Tất cả", "Nam", "Nữ", "Khác"];
const rowsPerPageOptions = [5, 10, 20];
const apiBaseUrl = "http://localhost:8080/nhanVien";
const provinceApiUrl = "https://provinces.open-api.vn/api/?depth=1";
const districtApiUrl = code => `https://provinces.open-api.vn/api/p/${code}?depth=2`;
const roleListAPI = "http://localhost:8080/vaiTro/list";

function getGenderLabel(gender) {
    if (gender === "Nam" || gender === 1) return "Nam";
    if (gender === "Nữ" || gender === 0) return "Nữ";
    return "Khác";
}

const STATUS_OPTIONS = [
    { value: 1, label: "Đang hoạt động" },
    { value: 0, label: "Ngừng hoạt động" },
];

function getStatusLabel(status, statusOptions) {
    const found = statusOptions.find(s => s.value === status || s.label === status);
    if (found) return found.label;
    if (status === 1 || status === "Đang hoạt động") return "Đang hoạt động";
    return "Ngừng hoạt động";
}

function getPaginationArray(currentPage, totalPages) {
    if (totalPages <= 4) {
        return Array.from({ length: totalPages }, (_, i) => i);
    }
    if (currentPage <= 1) {
        return [0, 1, "...", totalPages - 2, totalPages - 1];
    }
    if (currentPage >= totalPages - 2) {
        return [0, 1, "...", totalPages - 2, totalPages - 1];
    }
    return [0, 1, "...", currentPage, "...", totalPages - 2, totalPages - 1];
}

// Tạo roleMap từ roleOptions (id -> ten)
function getRoleMap(roleOptions) {
    const map = {};
    roleOptions.forEach(r => {
        map[r.id] = r.ten;
    });
    return map;
}

// Lấy tên vai trò: ưu tiên tenVaiTro, sau đó map từ idVaiTro
function getRoleName(row, roleMap) {
    if (row && row.tenVaiTro) return row.tenVaiTro;
    if (row && row.idVaiTro && roleMap && roleMap[row.idVaiTro]) return roleMap[row.idVaiTro];
    return "Chưa xác định";
}

function NhanVienTable() {
    const [nhanVienData, setNhanVienData] = useState({
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
    const [statusOptions] = useState(STATUS_OPTIONS);
    const [roleOptions, setRoleOptions] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(0);
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    // State để show detail form
    const [showDetail, setShowDetail] = useState(false);
    const [detailId, setDetailId] = useState(null);

    useEffect(() => {
        fetchEmployees();
    }, [search, genderFilter, statusFilter, rowsPerPage, currentPage]);

    async function fetchEmployees() {
        setLoading(true);
        setError(null);
        try {
            let params = {
                page: currentPage,
                size: rowsPerPage,
                hoVaTen: search,
            };
            if (genderFilter !== "Tất cả") {
                params.gioiTinh = genderFilter;
            }
            if (statusFilter !== "Tất cả") {
                const statusObj = statusOptions.find(s => s.label === statusFilter);
                if (statusObj) {
                    params.trangThai = statusObj.value;
                }
            }
            const response = await axios.get(apiBaseUrl, { params });
            setNhanVienData({
                ...response.data,
                content: response.data.content || [],
            });
        } catch (error) {
            setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
            setNhanVienData({
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
        axios.get(provinceApiUrl).then(res => {});
        axios.get(roleListAPI).then(res => setRoleOptions(Array.isArray(res.data) ? res.data : []));
    }, []);

    function handlePageChange(newPage) {
        if (
            typeof newPage === "number" &&
            newPage >= 0 &&
            newPage < nhanVienData.totalPages &&
            newPage !== currentPage
        ) {
            setCurrentPage(newPage);
        }
    }

    function handleSearchChange(event) {
        setSearch(event.target.value);
        setCurrentPage(0);
    }
    function handleGenderFilterChange(event) {
        setGenderFilter(event.target.value);
        setCurrentPage(0);
    }
    function handleStatusFilterChange(event) {
        setStatusFilter(event.target.value);
        setCurrentPage(0);
    }
    function handleRowsPerPageChange(event) {
        setRowsPerPage(Number(event.target.value));
        setCurrentPage(0);
    }

    function handleNotificationClose(event, reason) {
        if (reason === "clickaway") return;
        setNotification({ ...notification, open: false });
    }

    const roleMap = getRoleMap(roleOptions);

    // CHUYỂN FORM: Nếu đang xem chi tiết thì show component detail
    if (showDetail && detailId) {
        return (
            <NhanVienDetail
                id={detailId}
                onClose={() => {
                    setShowDetail(false);
                    setDetailId(null);
                }}
            />
        );
    }

    const columns = [
        { name: "stt", label: "STT", align: "center", width: "60px" },
        {
            name: "maNhanVien",
            label: "Mã nhân viên",
            align: "left",
            width: "90px",
        },
        {
            name: "hoVaTen",
            label: "Họ và tên",
            align: "left",
            width: "170px",
            render: (value, row) => (
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Avatar src={row.hinhAnh || row.anh || "/default-avatar.png"} alt={value} />
                    <span>{value}</span>
                </Box>
            ),
        },
        {
            name: "vaiTro",
            label: "Chức vụ",
            align: "center",
            width: "110px",
            render: (_, row) => getRoleName(row, roleMap),
        },
        {
            name: "soDienThoai",
            label: "Số điện thoại",
            align: "center",
            width: "120px",
        },
        {
            name: "gioiTinh",
            label: "Giới tính",
            align: "center",
            width: "90px",
            render: value => getGenderLabel(value),
        },
        {
            name: "diaChi",
            label: "Địa chỉ",
            align: "center",
            width: "230px",
            render: (_, row) => {
                if (row.diaChi && row.diaChi.trim() !== "") return row.diaChi;
                let xa = row.xaPhuong || "";
                let huyen = row.quanHuyen || "";
                let tinh = row.tinhThanhPho || "";
                return [xa, huyen, tinh].filter(Boolean).join(", ");
            },
        },
        {
            name: "trangThai",
            label: "Trạng thái",
            align: "center",
            width: "110px",
            render: value => (
                <span
                    style={{
                        background: getStatusLabel(value, statusOptions) === "Đang làm" ? "#bdbdbd" : "#b6e6f6",
                        color: getStatusLabel(value, statusOptions) === "Đang làm" ? "#219653" : "#bdbdbd",
                        border: "1px solid " + (getStatusLabel(value, statusOptions) === "Đang làm" ? "#219653" : "#bdbdbd"),
                        borderRadius: 6,
                        fontWeight: 500,
                        padding: "2px 12px",
                        fontSize: 13,
                        display: "inline-block",
                    }}
                >
                    {getStatusLabel(value, statusOptions)}
                </span>
            ),
        },
        {
            name: "actions",
            label: "Thao tác",
            align: "center",
            width: "140px",
            render: (_, row) => (
                <SoftBox display="flex" gap={0.5} justifyContent="center">
                    <IconButton
                        size="small"
                        sx={{ color: "#4acbf2" }}
                        title="Chi tiết"
                        onClick={() => {
                            setShowDetail(true);
                            setDetailId(row.id);
                        }}
                    >
                        <FaEye />
                    </IconButton>
                    <IconButton
                        size="small"
                        sx={{ color: "#f7b731" }}
                        title="Sửa"
                        onClick={() => {/* handleEditOpen(row) */}}
                    >
                        <FaEdit />
                    </IconButton>
                </SoftBox>
            ),
        },
    ];

    const rows = nhanVienData.content.map((item, idx) => ({
        stt: currentPage * rowsPerPage + idx + 1,
        id: item.id,
        maNhanVien: item.maNhanVien,
        hoVaTen: item.hoVaTen,
        soDienThoai: item.soDienThoai || item.sdt || "",
        gioiTinh: item.gioiTinh,
        tinhThanhPho: item.tinhThanhPho || "",
        quanHuyen: item.quanHuyen || "",
        xaPhuong: item.xaPhuong || "",
        diaChi: item.diaChi || "",
        trangThai: item.trangThai,
        idVaiTro: item.idVaiTro,
        tenVaiTro: item.tenVaiTro,
        hinhAnh: item.hinhAnh || item.anh || "",
        actions: "",
    }));

    const paginationItems = getPaginationArray(nhanVienData.number, nhanVienData.totalPages);

    return (
        <DashboardLayout>
            <Notifications
                open={notification.open}
                onClose={handleNotificationClose}
                message={notification.message}
                severity={notification.severity}
                autoHideDuration={2500}
            />
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
                                placeholder="Tìm kiếm nhân viên"
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
                                    {genderOptions.map(gender => (
                                        <MenuItem key={gender} value={gender}>
                                            {gender}
                                        </MenuItem>
                                    ))}
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
                                    <MenuItem value="Tất cả">Tất cả</MenuItem>
                                    {statusOptions.map(status => (
                                        <MenuItem key={status.value} value={status.label}>
                                            {status.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </SoftBox>
                        <SoftBox display="flex" alignItems="center" gap={1}>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<FaFileExcel />}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 400,
                                    color: "#43a047",
                                    borderColor: "#43a047",
                                    boxShadow: "none",
                                    "&:hover": {
                                        borderColor: "#1769aa",
                                        background: "#e8f5e9",
                                        color: "#1769aa",
                                    },
                                }}
                                onClick={() => {
                                    const sheetData = [
                                        [
                                            "STT",
                                            "Mã nhân viên",
                                            "Họ và tên",
                                            "Chức vụ",
                                            "Số điện thoại",
                                            "Giới tính",
                                            "Địa chỉ",
                                            "Trạng thái"
                                        ],
                                        ...nhanVienData.content.map((item, idx) => {
                                            let address = (item.diaChi && item.diaChi.trim() !== "")
                                                ? item.diaChi
                                                : [item.xaPhuong, item.quanHuyen, item.tinhThanhPho].filter(Boolean).join(", ");
                                            let roleName = getRoleName(item, roleMap);
                                            return [
                                                currentPage * rowsPerPage + idx + 1,
                                                item.maNhanVien,
                                                item.hoVaTen,
                                                roleName,
                                                item.soDienThoai || item.sdt,
                                                getGenderLabel(item.gioiTinh),
                                                address,
                                                getStatusLabel(item.trangThai, statusOptions),
                                            ];
                                        }),
                                    ];
                                    const workbook = XLSX.utils.book_new();
                                    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
                                    XLSX.utils.book_append_sheet(workbook, worksheet, "NhanVien");
                                    XLSX.writeFile(workbook, "danh_sach_nhan_vien.xlsx");
                                }}
                            >
                                Xuất Excel
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<FaFilePdf />}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 400,
                                    color: "#d32f2f",
                                    borderColor: "#d32f2f",
                                    boxShadow: "none",
                                    "&:hover": {
                                        borderColor: "#1769aa",
                                        background: "#ffebee",
                                        color: "#1769aa",
                                    },
                                }}
                                onClick={() => {
                                    const doc = new jsPDF({
                                        orientation: "landscape",
                                    });
                                    doc.setFontSize(17);
                                    doc.text("Danh sách nhân viên", 14, 18);
                                    const tableColumn = [
                                        "STT",
                                        "Mã nhân viên",
                                        "Họ và tên",
                                        "Chức vụ",
                                        "Số điện thoại",
                                        "Giới tính",
                                        "Địa chỉ",
                                        "Trạng thái",
                                    ];
                                    const tableRows = nhanVienData.content.map((item, idx) => {
                                        let address = (item.diaChi && item.diaChi.trim() !== "")
                                            ? item.diaChi
                                            : [item.xaPhuong, item.quanHuyen, item.tinhThanhPho].filter(Boolean).join(", ");
                                        let roleName = getRoleName(item, roleMap);
                                        return [
                                            currentPage * rowsPerPage + idx + 1,
                                            item.maNhanVien,
                                            item.hoVaTen,
                                            roleName,
                                            item.soDienThoai || item.sdt,
                                            getGenderLabel(item.gioiTinh),
                                            address,
                                            getStatusLabel(item.trangThai, statusOptions),
                                        ];
                                    });
                                    doc.autoTable({
                                        head: [tableColumn],
                                        body: tableRows,
                                        startY: 28,
                                        styles: { fontSize: 10 },
                                        headStyles: { fillColor: [73, 163, 241] },
                                    });
                                    doc.save("danh_sach_nhan_vien.pdf");
                                }}
                            >
                                Xuất PDF
                            </Button>
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
                                onClick={() => window.location.assign("/nhanvien/add")}
                            >
                                Thêm nhân viên
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
                                    value={rowsPerPage}
                                    onChange={handleRowsPerPageChange}
                                    size="small"
                                >
                                    {rowsPerPageOptions.map(number => (
                                        <MenuItem key={number} value={number}>
                                            Xem {number}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </SoftBox>
                        <SoftBox display="flex" alignItems="center" gap={1}>
                            <Button
                                variant="text"
                                size="small"
                                disabled={nhanVienData.first}
                                onClick={() => handlePageChange(currentPage - 1)}
                                sx={{ color: nhanVienData.first ? "#bdbdbd" : "#49a3f1" }}
                            >
                                Trước
                            </Button>
                            {paginationItems.map((item, idx) =>
                                item === "..."
                                    ? (
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
                                    ) : (
                                        <Button
                                            key={item}
                                            variant={nhanVienData.number === item ? "contained" : "text"}
                                            color={nhanVienData.number === item ? "info" : "inherit"}
                                            size="small"
                                            onClick={() => handlePageChange(item)}
                                            sx={{
                                                minWidth: 32,
                                                borderRadius: 2,
                                                color: nhanVienData.number === item ? "#fff" : "#495057",
                                                background: nhanVienData.number === item ? "#49a3f1" : "transparent",
                                            }}
                                        >
                                            {item + 1}
                                        </Button>
                                    )
                            )}
                            <Button
                                variant="text"
                                size="small"
                                disabled={nhanVienData.last}
                                onClick={() => handlePageChange(currentPage + 1)}
                                sx={{ color: nhanVienData.last ? "#bdbdbd" : "#49a3f1" }}
                            >
                                Sau
                            </Button>
                        </SoftBox>
                    </SoftBox>
                </Card>
            </SoftBox>
            <Footer />
        </DashboardLayout>
    );
}

export default NhanVienTable;