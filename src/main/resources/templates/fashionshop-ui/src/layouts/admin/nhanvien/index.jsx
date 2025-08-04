import React, { useState, useEffect } from "react";
import {
    Card,
    IconButton,
    Button,
    Input,
    InputAdornment,
    Select,
    MenuItem,
    FormControl,
    Box,
    Avatar,
    Slider,
    Typography,
    RadioGroup,
    Radio,
    FormControlLabel
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FaPlus, FaEye, FaFileExcel, FaFilePdf } from "react-icons/fa";
import Icon from "@mui/material/Icon";
import SoftBox from "../../../components/SoftBox";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../examples/Footer";
import Table from "../../../examples/Tables/Table";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
// SỬA Ở ĐÂY: import đúng autoTable
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const API_BASE_URL = "http://localhost:8080/nhanVien";
const roleListAPI = "http://localhost:8080/vaiTro/list";

const STATUS_OPTIONS = [
    { value: "", label: "Tất cả" },
    { value: 1, label: "Đang làm việc" },
    { value: 0, label: "Đã nghỉ" },
];

const GENDER_OPTIONS = [
    { value: "", label: "Tất cả" },
    { value: 1, label: "Nam" },
    { value: 0, label: "Nữ" },
    { value: 2, label: "Khác" },
];

const VIEW_OPTIONS = [5, 10, 20, 50];

const StyledRadioGroup = styled(RadioGroup)({
    display: "flex",
    flexDirection: "row",
    gap: 2,
    "& .MuiFormControlLabel-root": {
        margin: 0,
        marginRight: 8,
        "& .MuiRadio-root": {
            color: "#90caf9",
            padding: "4px",
            "&.Mui-checked": { color: "#1976d2" }
        },
        "& .MuiFormControlLabel-label": {
            fontSize: 13,
            fontWeight: 500,
            color: "#333",
            marginLeft: "6px"
        }
    }
});

function getGenderLabel(gender) {
    if (gender === "Nam" || gender === 1) return "Nam";
    if (gender === "Nữ" || gender === 0) return "Nữ";
    if (gender === "Khác" || gender === 2) return "Khác";
    return "Khác";
}
function getStatusLabel(status) {
    if (status === 1 || status === "Đang làm việc") return "Đang làm việc";
    if (status === 0 || status === "Đã nghỉ") return "Đã nghỉ";
    return "Đã nghỉ";
}
function getPaginationItems(currentPage, totalPages) {
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const items = [];
    if (currentPage > 2) {
        items.push(1);
        if (currentPage > 3) items.push("...");
    }
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) {
        items.push(i);
    }
    if (currentPage < totalPages - 1) {
        if (currentPage < totalPages - 2) items.push("...");
        items.push(totalPages);
    }
    return items;
}

function getRoleMap(roleOptions) {
    const map = {};
    roleOptions.forEach((r) => {
        map[r.id] = r.ten;
    });
    return map;
}

function getRoleName(row, roleMap) {
    if (row && row.tenVaiTro) {
        return row.tenVaiTro;
    }
    if (row && row.idVaiTro && roleMap && roleMap[row.idVaiTro]) {
        return roleMap[row.idVaiTro];
    }
    return "Chưa xác định";
}

function NhanVienTable() {
    const [employees, setEmployees] = useState([]);
    const [pagination, setPagination] = useState({
        totalPages: 0,
        pageNo: 1,
        pageSize: 5,
        totalElements: 0,
    });
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [sortBy, setSortBy] = useState("id");
    const [sortDir, setSortDir] = useState("desc");

    const [filterEmployeeName, setFilterEmployeeName] = useState("");
    const [filterPhoneNumber, setFilterPhoneNumber] = useState("");
    const [filterRole, setFilterRole] = useState("");
    const [genderFilter, setGenderFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [roleOptions, setRoleOptions] = useState([]);
    const [ageRange, setAgeRange] = useState([18, 100]);
    const [minAge, setMinAge] = useState(18);
    const [maxAge, setMaxAge] = useState(100);
    const [showFilterSection, setShowFilterSection] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const roleMap = getRoleMap(roleOptions);

    useEffect(() => {
        setMinAge(ageRange[0]);
        setMaxAge(ageRange[1]);
    }, [ageRange]);

    function handleFilterChange(setter) {
        return function (value) {
            setter(value);
            setPageNo(1);
        };
    }

    useEffect(() => {
        axios.get(roleListAPI).then((res) => {
            setRoleOptions(Array.isArray(res.data) ? res.data : []);
        });
    }, []);

    useEffect(() => {
        function fetchEmployees() {
            setLoading(true);
            setError(null);

            const params = {
                page: pageNo - 1,
                size: pageSize,
                sortBy,
                sortDir,
            };
            if (filterEmployeeName) params.hoVaTen = filterEmployeeName;
            if (filterPhoneNumber) params.soDienThoai = filterPhoneNumber;
            if (genderFilter !== "") params.gioiTinh = genderFilter;
            if (statusFilter !== "") params.trangThai = statusFilter;
            if (filterRole) params.idVaiTro = filterRole;
            if (minAge) params.minAge = minAge;
            if (maxAge) params.maxAge = maxAge;

            axios
                .get(API_BASE_URL, { params })
                .then((response) => {
                    setEmployees(response.data.content || []);
                    setPagination({
                        totalPages: response.data.totalPages,
                        pageNo: response.data.number + 1,
                        pageSize: response.data.size,
                        totalElements: response.data.totalElements,
                    });
                })
                .catch(() => {
                    setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
                    setEmployees([]);
                    setPagination({});
                })
                .finally(() => {
                    setLoading(false);
                });
        }
        fetchEmployees();
    }, [
        pageNo,
        pageSize,
        sortBy,
        sortDir,
        filterEmployeeName,
        filterPhoneNumber,
        genderFilter,
        statusFilter,
        filterRole,
        minAge,
        maxAge,
    ]);

    function handlePageChange(newPage) {
        if (
            typeof newPage === "number" &&
            newPage >= 1 &&
            newPage <= pagination.totalPages &&
            newPage !== pageNo
        ) {
            setPageNo(newPage);
        }
    }

    function handleRowsPerPageChange(e) {
        setPageSize(Number(e.target.value));
        setPageNo(1);
    }

    function handleGenderFilterChange(event) {
        setGenderFilter(event.target.value);
        setPageNo(1);
    }

    function handleStatusFilterChange(event) {
        setStatusFilter(event.target.value);
        setPageNo(1);
    }

    function handleRoleFilterChange(event) {
        setFilterRole(event.target.value);
        setPageNo(1);
    }

    function handleAgeRangeChange(event, newValue) {
        setAgeRange(newValue);
        setMinAge(newValue[0]);
        setMaxAge(newValue[1]);
        setPageNo(1);
    }

    function handleResetFilters() {
        setFilterEmployeeName("");
        setFilterPhoneNumber("");
        setGenderFilter("");
        setStatusFilter("");
        setFilterRole("");
        setAgeRange([18, 100]);
        setMinAge(18);
        setMaxAge(100);
        setSortBy("id");
        setSortDir("desc");
        setPageNo(1);
        setShowFilterSection(false);
    }

    const columns = [
        { name: "stt", label: "STT", align: "center", width: "60px" },
        { name: "maNhanVien", label: "Mã nhân viên", align: "left", width: "90px" },
        {
            name: "hoVaTen",
            label: "Họ và tên",
            align: "left",
            width: "170px",
            render: (value, row) => (
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Avatar
                        src={row.hinhAnh || row.anh || "/default-avatar.png"}
                        alt={value}
                    />
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
        { name: "soDienThoai", label: "SĐT", align: "center", width: "120px" },
        {
            name: "gioiTinh",
            label: "Giới tính",
            align: "center",
            width: "90px",
            render: (value) => getGenderLabel(value),
        },
        {
            name: "diaChi",
            label: "Địa chỉ",
            align: "center",
            width: "230px",
            render: (_, row) => {
                if (row.diaChi && row.diaChi.trim() !== "") {
                    return row.diaChi;
                }
                const xa = row.xaPhuong || "";
                const tinh = row.tinhThanhPho || "";
                return [xa, tinh].filter(Boolean).join(", ");
            },
        },
        {
            name: "trangThai",
            label: "Trạng thái",
            align: "center",
            width: "110px",
            render: (value) => {
                const label = getStatusLabel(value);
                const isActive = label === "Đang làm việc";
                return (
                    <span
                        style={{
                            background: isActive ? "#e8f5e8" : "#fff3e0",
                            color: isActive ? "#2e7d32" : "#f57c00",
                            border: "1px solid " + (isActive ? "#2e7d32" : "#f57c00"),
                            borderRadius: 6,
                            fontWeight: 500,
                            padding: "2px 8px",
                            fontSize: 12,
                            display: "inline-block",
                        }}
                    >
                        {label}
                    </span>
                );
            },
        },
        {
            name: "actions",
            label: "Thao tác",
            width: "100px",
            align: "center",
            render: (_, r) => (
                <SoftBox display="flex" justifyContent="center">
                    <IconButton
                        size="small"
                        sx={{
                            color: "#1976d2",
                            background: "rgba(25, 118, 210, 0.08)",
                            "&:hover": {
                                background: "rgba(25, 118, 210, 0.15)",
                                transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease",
                        }}
                        title="Xem chi tiết & Chỉnh sửa"
                        onClick={() => navigate(`/nhanvien/detail/${r.id}`)}
                    >
                        <FaEye />
                    </IconButton>
                </SoftBox>
            ),
        },
    ];

    const rows = employees.map((item, idx) => ({
        stt: (pagination.pageNo - 1) * pagination.pageSize + idx + 1,
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

    function exportTableData() {
        return employees.map((item, idx) => {
            const address =
                item.diaChi && item.diaChi.trim()
                    ? item.diaChi
                    : [item.xaPhuong, item.quanHuyen, item.tinhThanhPho]
                        .filter(Boolean)
                        .join(", ");
            return [
                (pagination.pageNo - 1) * pagination.pageSize + idx + 1,
                item.maNhanVien,
                item.hoVaTen,
                item.soDienThoai || item.sdt,
                getGenderLabel(item.gioiTinh),
                address,
                getStatusLabel(item.trangThai),
            ];
        });
    }

    function handleExportExcel() {
        const sheetData = [
            [
                "STT",
                "Mã nhân viên",
                "Họ và tên",
                "Số điện thoại",
                "Giới tính",
                "Địa chỉ",
                "Trạng thái",
            ],
        ].concat(exportTableData());
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "NhanVien");
        XLSX.writeFile(workbook, "danh_sach_nhan_vien.xlsx");
    }

    function handleExportPDF() {
        const doc = new jsPDF({ orientation: "landscape" });
        doc.setFontSize(17);
        doc.text("Danh sách nhân viên", 14, 18);
        // SỬA Ở ĐÂY: dùng autoTable đúng chuẩn
        autoTable(doc, {
            head: [
                [
                    "STT",
                    "Mã nhân viên",
                    "Họ và tên",
                    "Số điện thoại",
                    "Giới tính",
                    "Địa chỉ",
                    "Trạng thái",
                ],
            ],
            body: exportTableData(),
            startY: 28,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [73, 163, 241] },
        });
        doc.save("danh_sach_nhan_vien.pdf");
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox
                py={3}
                sx={{
                    background: "#F4F6FB",
                    minHeight: "150vh",
                    userSelect: "none",
                }}
            >
                {/* Filter and action buttons */}
                <Card sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
                    <SoftBox display="flex" flexDirection={{ xs: "column", md: "row" }} alignItems="center" justifyContent="space-between" gap={2}>
                        <SoftBox flex={1} display="flex" alignItems="center" gap={2} maxWidth={600}>
                            <Input
                                fullWidth
                                placeholder="Tìm kiếm theo tên"
                                value={filterEmployeeName}
                                onChange={e => handleFilterChange(setFilterEmployeeName)(e.target.value)}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Icon fontSize="small" sx={{ color: "#868686" }}>
                                            search
                                        </Icon>
                                    </InputAdornment>
                                }
                                sx={{
                                    background: "#f5f6fa",
                                    borderRadius: 2,
                                    p: 0.5,
                                    color: "#222",
                                }}
                            />
                            <IconButton
                                onClick={() => setShowFilterSection(s => !s)}
                                sx={{
                                    color: showFilterSection ? "#fff" : "#49a3f1",
                                    border: "1px solid #49a3f1",
                                    borderRadius: 2,
                                    background: showFilterSection ? "#49a3f1" : "transparent",
                                    transition: "all 0.2s ease",
                                    "&:hover": {
                                        background: showFilterSection ? "#1769aa" : "rgba(73, 163, 241, 0.1)",
                                        transform: "scale(1.05)",
                                    }
                                }}
                                title={showFilterSection ? "Ẩn bộ lọc" : "Hiển thị bộ lọc"}
                            >
                                <Icon>filter_list</Icon>
                            </IconButton>
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
                                    "&:hover": { borderColor: "#1769aa", background: "#e8f5e9", color: "#1769aa" },
                                }}
                                onClick={handleExportExcel}
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
                                    "&:hover": { borderColor: "#1769aa", background: "#ffebee", color: "#1769aa" },
                                }}
                                onClick={handleExportPDF}
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
                                    "&:hover": { borderColor: "#1769aa", background: "#f0f6fd", color: "#1769aa" },
                                }}
                                onClick={() => navigate("/nhanvien/add")}
                            >
                                Thêm nhân viên
                            </Button>
                        </SoftBox>
                    </SoftBox>
                </Card>

                {/* Bộ lọc hiện đại */}
                {showFilterSection && (
                    <Card sx={{ p: { xs: 2, md: 2.5 }, mb: 2, background: "#f8fafc", border: "1px solid #e5e7eb" }}>
                        <SoftBox>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Icon sx={{ color: "#1769aa", fontSize: 20 }}>filter_list</Icon>
                                    <Typography variant="h6" fontWeight={600} fontSize={16} color="#1769aa">
                                        Bộ lọc
                                    </Typography>
                                </Box>
                                <IconButton
                                    onClick={() => setShowFilterSection(false)}
                                    size="small"
                                    sx={{ color: "#666", "&:hover": { background: "rgba(102, 102, 102, 0.1)" } }}
                                >
                                    <Icon fontSize="small">close</Icon>
                                </IconButton>
                            </Box>
                            <Box
                                display="grid"
                                gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" }}
                                gap={2.5}
                                alignItems="center"
                                mb={2}
                            >
                                {/* Giới tính */}
                                <Box minWidth={120}>
                                    <label style={{ fontWeight: 600, color: "#1769aa", mb: 0.5, fontSize: 13, display: "block" }}>Giới tính</label>
                                    <StyledRadioGroup
                                        name="filterGender"
                                        value={genderFilter}
                                        onChange={handleGenderFilterChange}
                                        row
                                    >
                                        {GENDER_OPTIONS.map(option => (
                                            <FormControlLabel
                                                key={option.value}
                                                value={option.value}
                                                control={<Radio />}
                                                label={option.label}
                                            />
                                        ))}
                                    </StyledRadioGroup>
                                </Box>
                                {/* Trạng thái */}
                                <Box minWidth={150}>
                                    <label style={{ fontWeight: 600, color: "#1769aa", mb: 0.5, fontSize: 13, display: "block" }}>Trạng thái</label>
                                    <StyledRadioGroup
                                        name="filterStatus"
                                        value={statusFilter}
                                        onChange={handleStatusFilterChange}
                                        row
                                    >
                                        {STATUS_OPTIONS.map(option => (
                                            <FormControlLabel
                                                key={option.value}
                                                value={option.value}
                                                control={<Radio />}
                                                label={option.label}
                                            />
                                        ))}
                                    </StyledRadioGroup>
                                </Box>
                                {/* Chức vụ */}
                                <Box minWidth={120}>
                                    <label style={{ fontWeight: 600, color: "#1769aa", mb: 0.5, fontSize: 13, display: "block" }}>Chức vụ</label>
                                    <FormControl fullWidth>
                                        <Select
                                            value={filterRole}
                                            onChange={handleRoleFilterChange}
                                            size="small"
                                            displayEmpty
                                            sx={{ borderRadius: 2, background: "#f5f6fa", height: 40 }}
                                            inputProps={{ "aria-label": "Chức vụ" }}
                                        >
                                            <MenuItem value="">Tất cả</MenuItem>
                                            {roleOptions.map((role) => (
                                                <MenuItem key={role.id} value={role.id}>
                                                    {role.ten}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>
                                {/* Khoảng tuổi */}
                                <Box minWidth={180} maxWidth={260}>
                                    <label style={{ fontWeight: 600, color: "#1769aa", mb: 0.5, fontSize: 13, display: "block" }}>
                                        Khoảng tuổi: <strong>{ageRange[0]} - {ageRange[1]}</strong>
                                    </label>
                                    <Slider
                                        value={ageRange}
                                        onChange={handleAgeRangeChange}
                                        valueLabelDisplay="off"
                                        min={18}
                                        max={100}
                                        sx={{ mt: 1, width: "100%" }}
                                    />
                                </Box>
                            </Box>
                            <Box display="flex" gap={2} justifyContent="space-between" alignItems="center" pt={1} borderTop="1px solid #e5e7eb">
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<Icon fontSize="small">clear</Icon>}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: "none",
                                        color: "#666",
                                        borderColor: "#ccc",
                                        fontWeight: 500,
                                        fontSize: 13,
                                        "&:hover": {
                                            borderColor: "#999",
                                            background: "rgba(102, 102, 102, 0.05)",
                                            color: "#333"
                                        },
                                    }}
                                    onClick={handleResetFilters}
                                >
                                    Xóa bộ lọc
                                </Button>
                                <Typography variant="body2" color="#666" fontWeight={500} fontSize={13}>
                                    Tìm thấy <strong>{pagination.totalElements || 0}</strong> nhân viên
                                </Typography>
                            </Box>
                        </SoftBox>
                    </Card>
                )}

                {/* Table and pagination */}
                <Card sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
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
                        mt={2}
                        flexWrap="wrap"
                        gap={2}
                    >
                        <FormControl sx={{ minWidth: 120 }}>
                            <Select
                                value={pageSize}
                                onChange={handleRowsPerPageChange}
                                size="small"
                            >
                                {VIEW_OPTIONS.map(number => (
                                    <MenuItem key={number} value={number}>
                                        Xem {number}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <SoftBox display="flex" alignItems="center" gap={1}>
                            <Button
                                variant="text"
                                size="small"
                                disabled={pagination.pageNo === 1}
                                onClick={() => handlePageChange(pagination.pageNo - 1)}
                                sx={{
                                    color: pagination.pageNo === 1 ? "#bdbdbd" : "#49a3f1",
                                }}
                            >
                                Trước
                            </Button>
                            {getPaginationItems(pagination.pageNo, pagination.totalPages).map((item, idx) =>
                                item === "..." ? (
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
                                        variant={pagination.pageNo === item ? "contained" : "text"}
                                        color={pagination.pageNo === item ? "info" : "inherit"}
                                        size="small"
                                        onClick={() => handlePageChange(item)}
                                        sx={{
                                            minWidth: 32,
                                            borderRadius: 2,
                                            color:
                                                pagination.pageNo === item ? "#fff" : "#495057",
                                            background:
                                                pagination.pageNo === item
                                                    ? "#49a3f1"
                                                    : "transparent",
                                        }}
                                    >
                                        {item}
                                    </Button>
                                )
                            )}
                            <Button
                                variant="text"
                                size="small"
                                disabled={pagination.pageNo === pagination.totalPages}
                                onClick={() => handlePageChange(pagination.pageNo + 1)}
                                sx={{
                                    color:
                                        pagination.pageNo === pagination.totalPages
                                            ? "#bdbdbd"
                                            : "#49a3f1",
                                }}
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