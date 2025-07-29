import React, { useState, useEffect } from "react";
import { Card, IconButton, Button, Input, InputAdornment, Select, MenuItem, FormControl, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress, Box, Avatar, Slider, Typography, RadioGroup, Radio, FormControlLabel } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FaPlus, FaEye, FaTrash, FaFileExcel, FaFilePdf, FaEdit } from "react-icons/fa";
import Icon from "@mui/material/Icon";
import SoftBox from "components/SoftBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Table from "examples/Tables/Table";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import PropTypes from "prop-types";

// API URLs
const API_BASE_URL = "http://localhost:8080/nhanVien";

// Constants
const STATUS_OPTIONS = [
    { value: "ACTIVE", label: "Đang làm việc" },
    { value: "INACTIVE", label: "Đã nghỉ" },
];

const GENDER_OPTIONS = [
    { value: "Tất cả", label: "Tất cả" },
    { value: "MALE", label: "Nam" },
    { value: "FEMALE", label: "Nữ" },
];


// Utility functions
const getGenderLabel = (gender) => (gender === "MALE" ? "Nam" : gender === "FEMALE" ? "Nữ" : "Khác");
const getStatusLabel = (status, options) => {
    const found = options.find((s) => s.value === status || s.label === status);
    return found ? found.label : status === "ACTIVE" ? "Đang làm" : "Nghỉ";
};

// Styled component cho Radio Group
const StyledRadioGroup = styled(RadioGroup)({
  display: 'flex',
  flexDirection: 'row',
  gap: 2.5,
  '& .MuiFormControlLabel-root': {
    margin: 0,
    marginRight: 8,
    '& .MuiRadio-root': {
      color: '#90caf9',
      padding: '4px',
      '&.Mui-checked': {
        color: '#1976d2',
      },
      '&:hover': {
        background: 'rgba(25, 118, 210, 0.04)',
        borderRadius: '50%',
      },
    },
    '& .MuiFormControlLabel-label': {
      fontSize: 13,
      fontWeight: 500,
      color: '#333',
      marginLeft: '6px',
    },
  },
});

// Hàm tính tuổi từ ngày sinh
const calculateAge = (birthDate) => {
    if (!birthDate) {
        console.log("Ngày sinh rỗng:", birthDate);
        return null;
    }
    // Xử lý các format ngày khác nhau
    let date;
    if (typeof birthDate === 'string') {
        const trimmedDate = birthDate.trim();
        
        // Format: "DD/MM/YYYY" hoặc "YYYY/MM/DD"
        if (trimmedDate.includes('/')) {
            const parts = trimmedDate.split('/');
            if (parts[0].length === 4) {
                // Format: "YYYY/MM/DD"
                date = new Date(trimmedDate);
            } else {
                // Format: "DD/MM/YYYY"
                const [day, month, year] = parts;
                date = new Date(year, month - 1, day);
            }
        } else if (trimmedDate.includes('-')) {
            // Format: "YYYY-MM-DD" hoặc "DD-MM-YYYY"
            const parts = trimmedDate.split('-');
            if (parts[0].length === 4) {
                // Format: "YYYY-MM-DD"
                date = new Date(trimmedDate);
            } else {
                // Format: "DD-MM-YYYY"
                const [day, month, year] = parts;
                date = new Date(year, month - 1, day);
            }
        } else {
            // Thử parse trực tiếp
            date = new Date(trimmedDate);
        }
    } else {
        date = new Date(birthDate);
    }
    if (isNaN(date.getTime())) {
        console.warn("Không thể parse ngày sinh:", birthDate);
        return null;
    }
    
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
        age--;
    }
    // Kiểm tra tuổi hợp lệ
    if (age < 0 || age > 150) {
        console.warn("Tuổi không hợp lệ:", age, "từ ngày sinh:", birthDate);
        return null;
    }
    return age;
};

function generatePaginationDisplay(pageNo, totalPages) {
    if (totalPages <= 4) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (pageNo <= 2) return [1, 2, "...", totalPages - 1, totalPages];
    if (pageNo >= totalPages - 1) return [1, 2, "...", totalPages - 1, totalPages];
    return [1, 2, "...", pageNo, "...", totalPages - 1, totalPages];
}

function NhanVienTable() {
    // State variables
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
    const [filterGender, setFilterGender] = useState("Tất cả");
    const [filterStatus, setFilterStatus] = useState("Tất cả");

    const [minAge, setMinAge] = useState("");
    const [maxAge, setMaxAge] = useState("");
    const [ageRange, setAgeRange] = useState([18, 100]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    // State để quản lý việc hiển thị/ẩn phần lọc
    const [showFilterSection, setShowFilterSection] = useState(false);

    // Handle filter change to reset pageNo
    const handleFilterChange = (setter) => (value) => {
        setter(value);
        setPageNo(1); // Reset to page 1 when filter changes
    };

    // API params
    const params = {
        pageNo,
        pageSize,
        sortBy,
        sortDir,
        filterByEmployeeName: filterEmployeeName || undefined,
        filterByPhoneNumber: filterPhoneNumber || undefined,
        filterByGender: filterGender !== "Tất cả" ? filterGender : undefined,
        filterByStatus: filterStatus !== "Tất cả" ? filterStatus : undefined,
        minAge: minAge || undefined,
        maxAge: maxAge || undefined,
    };

    // Fetch employees
    useEffect(() => {
        const fetchEmployees = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(API_BASE_URL, { params });
                setEmployees(response.data.data.employees || []);
                setPagination(response.data.data.pagination || {});
            } catch {
                setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
                setEmployees([]);
                setPagination({});
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, [pageNo, pageSize, sortBy, sortDir, filterEmployeeName, filterPhoneNumber, filterGender, filterStatus, minAge, maxAge]);

    // Test function để kiểm tra format ngày sinh
    useEffect(() => {
        if (employees.length > 0) {
            console.log("=== DEBUG: Kiểm tra format ngày sinh ===");
            employees.forEach((emp, index) => {
                console.log(`${index + 1}. ${emp.hoVaTen}:`, {
                    ngaySinh: emp.ngaySinh,
                    type: typeof emp.ngaySinh,
                    length: emp.ngaySinh?.length,
                    hasSlash: emp.ngaySinh?.includes('/'),
                    hasDash: emp.ngaySinh?.includes('-')
                });
            });
            console.log("=== END DEBUG ===");
        }
    }, [employees]);

    // Handlers
    const handlePageChange = setPageNo;

    const handleRowsPerPageChange = (e) => {
        setPageSize(Number(e.target.value));
        setPageNo(1);
    };

    const handleAgeRangeChange = (event, newValue) => {
        console.log("Age range changed:", newValue);
        setAgeRange(newValue);
        setMinAge(newValue[0]);
        setMaxAge(newValue[1]);
        setPageNo(1); // Reset to page 1
    };

    const handleResetFilters = () => {
        setFilterEmployeeName("");
        setFilterPhoneNumber("");
        setFilterGender("Tất cả");
        setFilterStatus("Tất cả");
        setMinAge("");
        setMaxAge("");
        setAgeRange([18, 100]);
        setSortBy("id");
        setSortDir("desc");
        setPageNo(1);
    };

    // Hàm toggle hiển thị phần lọc
    const toggleFilterSection = () => {
        setShowFilterSection(!showFilterSection);
    };

    // Styled components cho form lọc - Compact version
    const labelStyle = { fontWeight: 600, color: "#1769aa", mb: 0.5, fontSize: 13, display: "block" };

    const getFieldSx = (focusField, name, errorField) => ({
        bgcolor: focusField === name ? "#e3f0fa" : "#fafdff",
        borderRadius: 1.5,
        boxShadow: focusField === name ? "0 0 0 2px #90caf9" : "none",
        transition: "all 0.2s",
        border: errorField === name ? "1px solid #d32f2f" : "none",
    });

    // Component FilterSelect - Compact version
      function FilterSelect({ label, name, value, options, onChange, disabled, error }) {
    const [focus, setFocus] = useState(false);
    return (
      <Box>
        <label style={labelStyle}>{label}</label>
        <FormControl
          fullWidth
          size="small"
          sx={{
            ...getFieldSx(focus ? name : "", name, error ? name : ""),
          }}
          disabled={disabled}
        >
          <Select
            name={name}
            value={value || ""}
            onChange={onChange}
            onFocus={() => {
              setFocus(true);
            }}
            onBlur={() => setFocus(false)}
            displayEmpty
            sx={{
              fontSize: 13,
              "& .MuiSelect-select": {
                padding: "6px 12px",
              }
            }}
          >
            {options.map(opt => (
              <MenuItem key={opt.value} value={opt.value} sx={{ fontSize: 13 }}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    );
  }

  // Component gộp cho sắp xếp
  function SortControl({ sortBy, sortDir, onSortByChange, onSortDirChange }) {
    const [focus, setFocus] = useState(false);
    return (
      <Box>
        <label style={labelStyle}>Sắp xếp</label>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <FormControl
            size="small"
            sx={{
              ...getFieldSx(focus ? "sortBy" : "", "sortBy", ""),
              minWidth: 120,
            }}
          >
            <Select
              name="sortBy"
              value={sortBy || ""}
              onChange={onSortByChange}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              displayEmpty
              sx={{
                fontSize: 13,
                "& .MuiSelect-select": {
                  padding: "6px 12px",
                }
              }}
            >
              <MenuItem value="id" sx={{ fontSize: 13 }}>Mã nhân viên</MenuItem>
              <MenuItem value="hoVaTen" sx={{ fontSize: 13 }}>Tên nhân viên</MenuItem>
              <MenuItem value="ngaySinh" sx={{ fontSize: 13 }}>Ngày sinh</MenuItem>
            </Select>
          </FormControl>
          <FormControl
            size="small"
            sx={{
              ...getFieldSx(focus ? "sortDir" : "", "sortDir", ""),
              minWidth: 100,
            }}
          >
            <Select
              name="sortDir"
              value={sortDir || ""}
              onChange={onSortDirChange}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              displayEmpty
              sx={{
                fontSize: 13,
                "& .MuiSelect-select": {
                  padding: "6px 12px",
                }
              }}
            >
              <MenuItem value="desc" sx={{ fontSize: 13 }}>Giảm dần</MenuItem>
              <MenuItem value="asc" sx={{ fontSize: 13 }}>Tăng dần</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    );
  }

      // PropTypes cho FilterSelect
  FilterSelect.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string,
    })).isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    error: PropTypes.bool,
  };

  // PropTypes cho SortControl
  SortControl.propTypes = {
    sortBy: PropTypes.string,
    sortDir: PropTypes.string,
    onSortByChange: PropTypes.func.isRequired,
    onSortDirChange: PropTypes.func.isRequired,
  };

    // Table configuration
    const columns = [
        { name: "stt", label: "STT", align: "center", width: "60px" },
        {
            name: "hinhAnh",
            label: "Ảnh",
            align: "center",
            width: "100px",
            render: (v, r) => (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Avatar 
                        src={v || "/default-avatar.png"} 
                        alt={r.hoVaTen} 
                        sx={{ 
                            width: 45, 
                            height: 45,
                            border: "2px solid #e3f2fd",
                            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                            background: v ? "transparent" : "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)",
                            color: "#1976d2",
                            fontWeight: 600,
                            fontSize: 18
                        }}
                    >
                        {!v && r.hoVaTen?.[0]?.toUpperCase()}
                    </Avatar>
                </Box>
            ),
        },
        { name: "maNhanVien", label: "Mã nhân viên", align: "left", width: "90px" },
        { 
            name: "hoVaTen", 
            label: "Họ và tên", 
            align: "left", 
            width: "200px",
            render: (v, r) => (
                <Box>
                    <Typography variant="body2" fontWeight={600} color="#1976d2">
                        {v}
                    </Typography>
                    <Typography variant="caption" color="#666" sx={{ fontSize: '12px' }}>
                        {r.email || "Chưa có email"}
                    </Typography>
                </Box>
            )
        },
        { name: "soDienThoai", label: "SĐT", align: "center", width: "120px" },
        { 
            name: "ngaySinh", 
            label: "Ngày sinh", 
            align: "center", 
            width: "140px",
            render: (v, r) => {
                const age = calculateAge(v);
                console.log(`Ngày sinh của ${r.hoVaTen}:`, v, "Tuổi:", age);
                
                return (
                    <Box textAlign="center">
                        <Typography variant="body2" fontWeight={500}>
                            {v || "Chưa có"}
                        </Typography>
                        {age !== null && age >= 0 && (
                            <Typography variant="caption" color="#1976d2" sx={{ fontSize: '11px', fontWeight: 600 }}>
                                ({age} tuổi)
                            </Typography>
                        )}
                        {age === null && v && (
                            <Typography variant="caption" color="#f57c00" sx={{ fontSize: '10px' }}>
                                (Lỗi format)
                            </Typography>
                        )}
                    </Box>
                );
            }
        },
        {
            name: "gioiTinh",
            label: "Giới tính",
            align: "center",
            width: "90px",
            render: (v) => {
                const isMale = v === "MALE";
                const isFemale = v === "FEMALE";
                const style = {
                    background: isMale ? "#e3f2fd" : isFemale ? "#fce4ec" : "#f5f5f5",
                    color: isMale ? "#1976d2" : isFemale ? "#c2185b" : "#888",
                    border: `1px solid ${isMale ? "#1976d2" : isFemale ? "#c2185b" : "#ccc"}`,
                    borderRadius: 6,
                    fontWeight: 500,
                    padding: "2px 8px",
                    fontSize: 12,
                    display: "inline-block",
                    width: 60,
                    minWidth: 60,
                    textAlign: "center",
                };
                return <span style={style}>{isMale ? "Nam" : isFemale ? "Nữ" : "Khác"}</span>;
            },
        },
        {
            name: "vaiTro",
            label: "Vai trò",
            align: "center",
            width: "100px",
            render: (v) => {
                const isAdmin = v === "ADMIN";
                const style = {
                    background: isAdmin ? "#fff3e0" : "#e8f5e8",
                    color: isAdmin ? "#f57c00" : "#2e7d32",
                    border: `1px solid ${isAdmin ? "#f57c00" : "#2e7d32"}`,
                    borderRadius: 6,
                    fontWeight: 500,
                    padding: "2px 8px",
                    fontSize: 12,
                    display: "inline-block",
                };
                return <span style={style}>{isAdmin ? "Quản lý" : "Nhân viên"}</span>;
            },
        },
        { name: "diaChi", label: "Địa chỉ", align: "center", width: "230px" },
        {
            name: "trangThai",
            label: "Trạng thái",
            align: "center",
            width: "110px",
            render: (v) => {
                const isWork = v === "ACTIVE";
                const style = {
                    background: isWork ? "#e6f4ea" : "#f4f6fb",
                    color: isWork ? "#219653" : "#bdbdbd",
                    border: `1px solid ${isWork ? "#219653" : "#bdbdbd"}`,
                    borderRadius: 6,
                    fontWeight: 500,
                    padding: "2px 12px",
                    fontSize: 13,
                    display: "inline-block",
                };
                return <span style={style}>{getStatusLabel(v, STATUS_OPTIONS)}</span>;
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
                                transform: "scale(1.1)"
                            },
                            transition: "all 0.2s ease"
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
        stt: (pageNo - 1) * pageSize + idx + 1,
        id: item.id,
        hinhAnh: item.hinhAnh || "",
        maNhanVien: item.maNhanVien,
        hoVaTen: item.hoVaTen,
        email: item.email || "", // Giữ lại để render trong cột họ tên
        soDienThoai: item.soDienThoai || "",
        ngaySinh: item.ngaySinh || "",
        gioiTinh: item.gioiTinh,
        vaiTro: item.vaiTro || "",
        diaChi: item.diaChi || "",
        trangThai: item.trangThai,
        actions: "",
    }));

    // Export handlers
    const exportTableData = () =>
        employees.map((item, idx) => {
            const address = item.diaChi?.trim() ? item.diaChi : [item.xaPhuong, item.quanHuyen, item.tinhThanhPho].filter(Boolean).join(", ");
            return [
                pageNo * pageSize + idx + 1,
                item.maNhanVien,
                item.hoVaTen,
                item.soDienThoai || item.sdt,
                getGenderLabel(item.gioiTinh),
                address,
                getStatusLabel(item.trangThai, STATUS_OPTIONS),
            ];
        });

    const handleExportExcel = () => {
        const sheetData = [["STT", "Mã nhân viên", "Họ và tên", "Số điện thoại", "Giới tính", "Địa chỉ", "Trạng thái"], ...exportTableData()];
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "NhanVien");
        XLSX.writeFile(workbook, "danh_sach_nhan_vien.xlsx");
    };

    const handleExportPDF = () => {
        const doc = new jsPDF({ orientation: "landscape" });
        doc.setFontSize(17);
        doc.text("Danh sách nhân viên", 14, 18);
        doc.autoTable({
            head: [["STT", "Mã nhân viên", "Họ và tên", "Số điện thoại", "Giới tính", "Địa chỉ", "Trạng thái"]],
            body: exportTableData(),
            startY: 28,
            styles: { fontSize: 10 },
            headStyles: { fillColor: [73, 163, 241] },
        });
        doc.save("danh_sach_nhan_vien.pdf");
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox py={3} sx={{ background: "#F4F6FB", minHeight: "150vh", userSelect: "none" }}>
                {/* Filter and action buttons */}
                <Card sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
                    <SoftBox display="flex" flexDirection={{ xs: "column", md: "row" }} alignItems="center" justifyContent="space-between" gap={2}>
                        <SoftBox flex={1} display="flex" alignItems="center" gap={2} maxWidth={600}>
                            <Input
                                fullWidth
                                placeholder="Tìm theo tên nhân viên"
                                value={filterEmployeeName}
                                onChange={(e) => handleFilterChange(setFilterEmployeeName)(e.target.value)}
                                startAdornment={<InputAdornment position="start"><Icon fontSize="small" sx={{ color: "#868686" }}>search</Icon></InputAdornment>}
                                sx={{ background: "#f5f6fa", borderRadius: 2, p: 0.5, color: "#222" }}
                            />
                            {/* Ẩn trường lọc số điện thoại - có thể bật lại sau */}
                            {/* <Input
                                fullWidth
                                placeholder="Nhập SĐT"
                                value={filterPhoneNumber}
                                onChange={(e) => handleFilterChange(setFilterPhoneNumber)(e.target.value)}
                                sx={{ background: "#f5f6fa", borderRadius: 2, p: 0.5, color: "#222", minWidth: 120 }}
                                inputProps={{ maxLength: 10 }}
                            /> */}
                            <IconButton
                                onClick={toggleFilterSection}
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
                        {/* Action buttons */}
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

                {/* Filter Section - Compact and User-Friendly */}
                {showFilterSection && (
                    <Card 
                        sx={{ 
                            p: { xs: 2, md: 2.5 }, 
                            mb: 2, 
                            background: "#f8fafc", 
                            border: "1px solid #e5e7eb",
                            animation: "slideDown 0.3s ease-out",
                            "@keyframes slideDown": {
                                "0%": {
                                    opacity: 0,
                                    transform: "translateY(-10px)",
                                },
                                "100%": {
                                    opacity: 1,
                                    transform: "translateY(0)",
                                },
                            },
                        }}
                    >
                        <SoftBox>
                            {/* Header with close button */}
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Icon sx={{ color: "#1769aa", fontSize: 20 }}>filter_list</Icon>
                                    <Typography variant="h6" fontWeight={600} fontSize={16} color="#1769aa">
                                        Bộ lọc
                                    </Typography>
                                </Box>
                                <IconButton
                                    onClick={toggleFilterSection}
                                    size="small"
                                    sx={{ 
                                        color: "#666",
                                        "&:hover": { background: "rgba(102, 102, 102, 0.1)" }
                                    }}
                                >
                                    <Icon fontSize="small">close</Icon>
                                </IconButton>
                            </Box>
                            
                            <Box component="form" autoComplete="off">
                                {/* Main filters in 3 rows for better layout */}
                                <Box
  display="grid"
  gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }}
  gap={2.5}
  alignItems="center"
  mb={2}
>
  {/* Giới tính */}
  <Box minWidth={120}>
    <label style={labelStyle}>Giới tính</label>
    <StyledRadioGroup
      name="filterGender"
      value={filterGender}
      onChange={(e) => handleFilterChange(setFilterGender)(e.target.value)}
      row
    >
      <FormControlLabel value="Tất cả" control={<Radio />} label="Tất cả" />
      <FormControlLabel value="MALE" control={<Radio />} label="Nam" />
      <FormControlLabel value="FEMALE" control={<Radio />} label="Nữ" />
    </StyledRadioGroup>
  </Box>
  {/* Trạng thái */}
  <Box minWidth={150}>
    <label style={labelStyle}>Trạng thái</label>
    <StyledRadioGroup
      name="filterStatus"
      value={filterStatus}
      onChange={(e) => handleFilterChange(setFilterStatus)(e.target.value)}
      row
    >
      <FormControlLabel value="Tất cả" control={<Radio />} label="Tất cả" />
      <FormControlLabel value="ACTIVE" control={<Radio />} label="Đang làm việc" />
      <FormControlLabel value="INACTIVE" control={<Radio />} label="Đã nghỉ" />
    </StyledRadioGroup>
  </Box>
  {/* Khoảng tuổi */}
  <Box minWidth={180} maxWidth={260}>
    <label style={labelStyle}>Khoảng tuổi: <strong>{ageRange[0]} - {ageRange[1]}</strong></label>
    <Slider
      value={ageRange}
      onChange={handleAgeRangeChange}
      valueLabelDisplay="off"
      min={18}
      max={100}
      sx={{ mt: 1, width: '100%' }}
    />
  </Box>
  {/* Sắp xếp */}
  <SortControl
    sortBy={sortBy}
    sortDir={sortDir}
    onSortByChange={(e) => handleFilterChange(setSortBy)(e.target.value)}
    onSortDirChange={(e) => handleFilterChange(setSortDir)(e.target.value)}
  />
</Box>



                                {/* Footer with actions and results */}
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
                            </Box>
                        </SoftBox>
                    </Card>
                )}

                {/* Table and pagination */}
                <Card sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
                    <SoftBox>{error ? <div className="alert alert-danger">{error}</div> : <Table columns={columns} rows={rows} loading={loading} />}</SoftBox>
                    <SoftBox display="flex" justifyContent="space-between" alignItems="center" mt={2} flexWrap="wrap" gap={2}>
                        <FormControl sx={{ minWidth: 120 }}>
                            <Select value={pageSize} onChange={handleRowsPerPageChange} size="small">
                                <MenuItem value={5}>Xem 5</MenuItem>
                                <MenuItem value={10}>Xem 10</MenuItem>
                                <MenuItem value={20}>Xem 20</MenuItem>
                                <MenuItem value={50}>Xem 50</MenuItem>
                            </Select>
                        </FormControl>
                        <SoftBox display="flex" alignItems="center" gap={1}>
                            <Button
                                variant="text"
                                size="small"
                                disabled={pagination.pageNo === 1}
                                onClick={() => handlePageChange(pageNo - 1)}
                                sx={{ color: pagination.pageNo === 1 ? "#bdbdbd" : "#49a3f1" }}
                            >
                                Trước
                            </Button>
                            {generatePaginationDisplay(pagination.pageNo, pagination.totalPages).map((item, idx) =>
                                item === "..." ? (
                                    <Button
                                        key={`ellipsis-${idx}`}
                                        variant="text"
                                        size="small"
                                        disabled
                                        sx={{ minWidth: 32, borderRadius: 2, color: "#bdbdbd", pointerEvents: "none", fontWeight: 700 }}
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
                                            color: pagination.pageNo === item ? "#fff" : "#495057",
                                            background: pagination.pageNo === item ? "#49a3f1" : "transparent",
                                        }}
                                    >
                                        {item}
                                    </Button>
                                )
                            )}
                            <Button
                                variant="text"
                                size="small"
                                disabled={pagination.pageNo >= pagination.totalPages}
                                onClick={() => handlePageChange(pageNo + 1)}
                                sx={{ color: pagination.pageNo >= pagination.totalPages ? "#bdbdbd" : "#49a3f1" }}
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