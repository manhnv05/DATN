// src/layouts/HoaDon/MainContent/OrderTable.jsx

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import PropTypes from "prop-types"; // Đảm bảo PropTypes được import
import Button from "@mui/material/Button"; // Import Button từ MUI
import Box from "@mui/material/Box"; // Import Box từ MUI

// Import các component tùy chỉnh của Soft UI
import Table from "../../../../examples/Tables/Table"; // Component Table của bạn
import SoftBox from "../../../../components/SoftBox";
import SoftTypography from "../../../../components/SoftTypography";
import SoftBadge from "../../../../components/SoftBadge";
import Icon from "@mui/material/Icon"; // Cho các icon như visibility
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton"; // Cho nút xem chi tiết
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress"; // Nếu bạn dùng spinner
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Skeleton from "@mui/material/Skeleton"; // Nếu bạn dùng skeleton loading

// === HÀM HELPER ĐỂ TẠO CÁC NÚT SỐ TRANG ===
// Đặt hàm này BÊN NGOÀI component để tối ưu hiệu suất
const generatePageNumbers = (currentPage, totalPages) => {
  // Logic của bạn để tạo mảng các số trang và "..."
  if (totalPages <= 5) {
    // Nếu tổng số trang ít hơn hoặc bằng 5, hiển thị tất cả
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Chuyển currentPage từ 0-based index sang 1-based page number
  const current = currentPage + 1;
  const pages = new Set();

  // Luôn thêm trang đầu và trang cuối
  pages.add(1);
  pages.add(totalPages);

  // Thêm các trang lân cận của trang hiện tại
  pages.add(current);
  if (current > 1) pages.add(current - 1);
  if (current < totalPages) pages.add(current + 1);

  // Sắp xếp và thêm dấu "..."
  const sortedPages = Array.from(pages).sort((a, b) => a - b);
  const result = [];
  let lastPage = 0;

  for (const page of sortedPages) {
    if (page > lastPage + 1) {
      result.push("...");
    }
    result.push(page);
    lastPage = page;
  }
  return result;
};

// =======================================================================

function OrderTable({ filterValues, currentPage, pageSize, setCurrentPage, setPageSize }) {
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusCounts, setStatusCounts] = useState({});

  // --- Thay đổi: Sử dụng chuỗi rỗng "" cho "Tất cả" trong trạng thái lọc ---
  const [filterStatus, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/hoa-don/status-counts");
        if (!response.ok) throw new Error("Không thể lấy dữ liệu trạng thái");
        const data = await response.json();
        setStatusCounts(data.data || {});
      } catch (error) {
        console.error("Lỗi fetch status counts:", error);
        setStatusCounts({});
      }
    };
    fetchStatusCounts();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ page: currentPage, size: pageSize });
        if (filterValues.searchTerm) params.append("searchTerm", filterValues.searchTerm);
        if (filterValues.ngayTaoStart) params.append("ngayTaoStart", filterValues.ngayTaoStart);
        if (filterValues.ngayTaoEnd) params.append("ngayTaoEnd", filterValues.ngayTaoEnd);
        if (filterValues.loaiHoaDon) params.append("loaiHoaDon", filterValues.loaiHoaDon);

        // --- Thay đổi: Chỉ gửi trangThai nếu nó không phải là chuỗi rỗng ---
        if (filterStatus) {
          params.append("trangThai", filterStatus);
        }

        const apiUrl = `http://localhost:8080/api/hoa-don?${params.toString()}`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);

        const rawResponseData = await response.json();
        setOrders(rawResponseData.data.content);
        setTotalPages(rawResponseData.data.totalPages);
        console.log("get đơn hàng" ,orders)
      } catch (err) {
        setError(err.message);
        setOrders([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [currentPage, pageSize, filterValues, filterStatus]);

  const handleStatusTabChange = (event, newStatus) => {
    setStatusFilter(newStatus);
    setCurrentPage(0); // Reset về trang đầu tiên khi đổi trạng thái lọc
  };

  // Styles cơ bản cho các SoftBadge trạng thái
  const baseBadgeStyles = {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "6px 12px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px", // Đã sửa lại fontSize cho badge
    border: "1px solid",
    width: "90px",
    whiteSpace: "nowrap",
    textAlign: "center",
    textTransform: "none", // Ngăn không cho chữ tự động viết hoa
    "& .MuiBadge-badge": {
      // Đảm bảo ghi đè text-transform cho phần tử chứa nội dung badge
      textTransform: "none",
    },
  };

  const columns = [
    { label: "STT", name: "stt", width: "5%", align: "center" },
    { label: "Mã", name: "maHoaDon" },
    { label: "Mã nhân viên", name: "maNhanVien",align: "center" },
    { label: "Tên khách hàng", name: "tenKhachHang" ,align: "center" },
    { label: "SĐT", name: "sdt" },
     { label: "Tổng tiền", name: "tongTien", align: "right" },
    

    {
      label: "Trạng thái",
      name: "trangThai",
      align: "center",
      render: (value) => {
        let text = "";
        let colorStyles = {};

        switch (value) {
          case "CHO_XAC_NHAN":
            text = "Chờ xác nhận";
            colorStyles = {
              color: "#ffc107",
              backgroundColor: "#fff3cd",
              borderColor: "#ffc107",
            };
            break;
          case "TAO_DON_HANG":
            text = "Tạo đơn hàng";
            colorStyles = {
            color: "#198754",
              backgroundColor: "#d1e7dd",
              borderColor: "#198754",
            };
            break;
            case "CHO_GIAO_HANG":
            text = "Chờ giao hàng";
            colorStyles = {
            color: "#198754",
              backgroundColor: "#d1e7dd",
              borderColor: "#198754",
            };
            break;
          case "DA_XAC_NHAN":
            text = "Đã xác nhận";
            colorStyles = {
               color: "#198754",
              backgroundColor: "#d1e7dd",
              borderColor: "#198754",
            };
            break;
          case "DANG_VAN_CHUYEN":
            text = "Vận chuyển";
            colorStyles = {
              color: "#ffc107",
              backgroundColor: "#fff3cd",
              borderColor: "#ffc107",
            };
            break;
          case "HOAN_THANH":
            text = "Hoàn thành";
            colorStyles = {
              color: "#198754",
              backgroundColor: "#d1e7dd",
              borderColor: "#198754",
            };
            break;
          case "HUY":
            text = "Đã hủy";
            colorStyles = {
              color: "#dc3545", // Đã chuyển lại màu danger theo mẫu bạn cung cấp cho "Đã hủy"
              backgroundColor: "#f8d7da",
              borderColor: "#dc3545",
            };
            break;
          default:
            text = value;
            colorStyles = {
              color: "#6c757d",
              backgroundColor: "#e2e3e5",
              borderColor: "#6c757d",
            };
        }

        return (
          <SoftBadge
            size="sm"
            badgeContent={text}
            container
            sx={{
              ...baseBadgeStyles,
              ...colorStyles,
            }}
          />
        );
      },
    },
   
    {
      label: "Loại đơn",
      name: "loaiHoaDon",
      align: "center",
      render: (value) => {
        let text = "";
        let colorStyles = {};
        switch (value) {
          case "online":
            text = "Trực tuyến";
            colorStyles = {
              color: "#0d6efd",
              backgroundColor: "#cfe2ff",
              borderColor: "#0d6efd",
            };
            break;
          case "Tại quầy":
            text = "Tại quầy";
            colorStyles = {
              color: "#198754",
              backgroundColor: "#d1e7dd",
              borderColor: "#198754",
            };
            break;
        }
        return (
          <SoftBadge
            size="sm"
            badgeContent={text}
            container
            sx={{
              ...baseBadgeStyles,
              ...colorStyles,
            }}
          />
        );
      },
    },
     {
      label: "Ngày tạo",
      name: "ngayTao",
      align: "center", // Thuộc tính align này đã căn giữa nội dung trong ô bảng
      render: (value) => {
        const formattedDate = value ? format(new Date(value), "HH:mm:ss dd/MM/yyyy") : "";

        return (
          <SoftTypography
            variant="caption" // Hoặc "body2", tùy thuộc bạn muốn font size thế nào
            fontWeight="medium" // Làm cho chữ hơi đậm lên
            sx={{
              color: "#495057", // Màu chữ xám đậm, ví dụ
              // color: '#0d6efd', // Hoặc màu xanh primary
              whiteSpace: "nowrap", // Ngăn không cho ngày giờ bị ngắt dòng nếu quá dài

              fontSize: "1rem", // Điều chỉnh kích thước font
              opacity: 0.6,
            }}
          >
            {formattedDate}
          </SoftTypography>
        );
      },
    },

    {
      label: "Hành động",
      name: "actions",
      align: "center",
      render: (value, row) => {
        return (
          <Tooltip title="Xem chi tiết" placement="top">
            <Link to={`/QuanLyHoaDon/${row.id}`}>
              <IconButton color="info">
                <Icon>visibility</Icon>
              </IconButton>
            </Link>
          </Tooltip>
        );
      }, // <<== Đổi ) thành }
    },
  ];

  const rows = orders.map((order, index) => {
    const tongSP = order.danhSachChiTiet
      ? order.danhSachChiTiet.reduce((sum, item) => sum + item.soLuong, 0)
      : 0;
    const tongTien = order.danhSachChiTiet
      ? order.danhSachChiTiet.reduce((sum, item) => sum + item.thanhTien, 0)
      : 0;
    return {
      ...order,
      stt: currentPage * pageSize + index + 1,
      tongSP,
       tongTien: `${(order.tongHoaDon || 0).toLocaleString("vi-VN")} đ`,

    };
  });

  return (
    <SoftBox>
      <SoftBox px={3} sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={filterStatus} onChange={handleStatusTabChange}>
          {[
            { key: "", label: "Tất cả" },
            { key: "CHO_XAC_NHAN", label: "Chờ xác nhận"},
            { key: "DA_XAC_NHAN", label: "Đã xác nhận"},
            { key: "CHO_GIAO_HANG", label: "Chờ giao hàng" },
            { key: "DANG_VAN_CHUYEN", label: "Đang vận chuyển" },
            { key: "HOAN_THANH", label: "Hoàn thành" },
            { key: "HUY", label: "Đã hủy" },
          ].map(({ key, label }) => (
            <Tab
              key={key}
              value={key}
              label={
                <SoftBox display="flex" alignItems="center" justifyContent="center">
                  <SoftTypography variant="body2" fontWeight="bold" sx={{ textTransform: "none" }}>
                    {label}
                  </SoftTypography>
                  {(statusCounts[key] || 0) > 0 && (
                    <Box
                      sx={{
                        ml: 0.5,
                        backgroundColor: "#dc3545",
                        color: "#fff",
                        borderRadius: "50%",
                        minWidth: "20px",
                        height: "20px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        padding: "0 4px",
                        textTransform: "none", // Đảm bảo count không viết hoa
                      }}
                    >
                      {statusCounts[key]}
                    </Box>
                  )}
                </SoftBox>
              }
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(73, 163, 241, 0.1)",
                },
                "&.Mui-selected": {
                  color: "#ffff !important",
                  backgroundColor: "#49a3f1 !important",
                },
                textTransform: "none",
              }}
            />
          ))}
        </Tabs>
      </SoftBox>

      {error && (
        <Alert severity="error" sx={{ m: 3, mt: 2 }}>
          {error}
        </Alert>
      )}
      <SoftBox p={3} pt={2}>
        {loading ? (
          <SoftBox>
            {[...Array(pageSize)].map((_, index) => (
              <Skeleton key={index} variant="rectangular" height={40} sx={{ my: 1 }} />
            ))}
          </SoftBox>
        ) : (
          <Table columns={columns} rows={rows} loading={false} />
        )}

        {!loading && !error && orders.length === 0 && (
          <SoftBox display="flex" justifyContent="center" p={3}>
            <SoftTypography>Không có dữ liệu đơn hàng nào.</SoftTypography>
          </SoftBox>
        )}
      </SoftBox>

      <SoftBox
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p={3}
        flexWrap="wrap"
        gap={2}
      >
        <SoftBox display="flex" alignItems="center" sx={{ flexShrink: 0 }}>
          <SoftTypography variant="body2" sx={{ mr: 1, whiteSpace: "nowrap", color: "#49a3f1" }}>
            Hiển thị:
          </SoftTypography>
          <Select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(0);
            }}
            sx={{ height: "35px", minWidth: "70px" }}
            displayEmpty
            renderValue={(selected) => {
              if (selected === 5) return "5 hóa đơn";
              if (selected === 10) return "10 hóa đơn";
              if (selected === 20) return "20 hóa đơn";
              return String(selected);
            }}
          >
            <MenuItem value={5}>5 hóa đơn</MenuItem>
            <MenuItem value={10}>10 hóa đơn</MenuItem>
            <MenuItem value={20}>20 hóa đơn</MenuItem>
          </Select>
        </SoftBox>

        {/* PHẦN PHÂN TRANG CHÍNH */}
        <SoftBox display="flex" alignItems="center" gap={1} sx={{ flexShrink: 0, ml: "20px" }}>
          {/* Nút "Trước" */}
          <Button
            variant="text"
            size="small"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            sx={{
              color: currentPage === 0 ? "#bdbdbd" : "#495057",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(73, 163, 241, 0.08)",
              },
            }}
          >
            Trước
          </Button>

         
          {totalPages > 0 &&
            generatePageNumbers(currentPage, totalPages).map((pageNumber, index) =>
              pageNumber === "..." ? (
                <SoftTypography
                  key={`ellipsis-${index}`}
                  variant="body2"
                  sx={{ mx: 0.5, color: "#495057" }}
                >
                  ...
                </SoftTypography>
              ) : (
                <Button
                  key={`page-${pageNumber}`}
                  variant={currentPage === pageNumber - 1 ? "contained" : "text"}
                  color={currentPage === pageNumber - 1 ? "info" : "inherit"}
                  size="small"
                  onClick={() => setCurrentPage(pageNumber - 1)}
                  sx={{
                    minWidth: 32,
                    borderRadius: 2,
                    textTransform: "none",
                    background: currentPage === pageNumber - 1 ? "#49a3f1" : "transparent",
                    color: currentPage === pageNumber - 1 ? "#fff" : "#495057",
                    "&:hover": {
                      backgroundColor:
                        currentPage === pageNumber - 1 ? "#49a3f1" : "rgba(73, 163, 241, 0.08)",
                    },
                  }}
                >
                  {pageNumber}
                </Button>
              )
            )}

          {/* Nút "Sau" */}
          <Button
            variant="text"
            size="small"
            disabled={currentPage >= totalPages - 1 || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            sx={{
              color: currentPage >= totalPages - 1 || totalPages === 0 ? "#bdbdbd" : "#495057",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "rgba(73, 163, 241, 0.08)",
              },
            }}
          >
            Sau
          </Button>
        </SoftBox>
      </SoftBox>
    </SoftBox>
  );
}
OrderTable.propTypes = {
  filterValues: PropTypes.shape({
    searchTerm: PropTypes.string,
    ngayTaoStart: PropTypes.string,
    ngayTaoEnd: PropTypes.string,
    loaiHoaDon: PropTypes.string,
  }).isRequired,

  currentPage: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  setPageSize: PropTypes.func.isRequired,
};

export default OrderTable;
