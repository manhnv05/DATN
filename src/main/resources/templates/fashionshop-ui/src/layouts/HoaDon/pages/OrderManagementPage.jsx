// src/component/MainContent/OrderManagementPage.jsx

import React, { useState } from "react";

// Import các component layout chuẩn
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import SoftBox from "components/SoftBox";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import SoftTypography from "components/SoftTypography";

// Import 2 component con
import OrderFilter from "../MainContent/OrderFilter";
import OrderTable from "../MainContent/OrderTable";
function OrderManagementPage() {
  // State để lưu trữ tất cả các giá trị lọc
  const [filterValues, setFilterValues] = useState({
    searchTerm: "",
    ngayTaoStart: "",
    ngayTaoEnd: "",
    loaiHoaDon: "",
  });

  // State cho phân trang, quản lý ở component cha
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  // Hàm được truyền xuống OrderFilter để cập nhật bộ lọc và reset trang
  const handleFilterChange = (newFilters) => {
    setFilterValues(newFilters);
    setCurrentPage(0); // Reset về trang đầu tiên khi có bộ lọc mới
  };

  // Hàm để xóa tất cả các bộ lọc và tải lại trang đầu tiên
  const handleClearFilters = () => {
    setFilterValues({
      searchTerm: "",
      ngayTaoStart: "",
      ngayTaoEnd: "",
      loaiHoaDon: "",
    });
    setCurrentPage(0); // Reset về trang đầu tiên
  };

  return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox py={3}>
          <Grid container spacing={3}>
            {/* KHỐI BỘ LỌC */}
            <Grid item xs={12}>
              <OrderFilter
                  onFilterChange={handleFilterChange}
                  filterValues={filterValues}
                  onClearFilters={handleClearFilters}
              />
            </Grid>

            {/* KHỐI BẢNG DỮ LIỆU */}
            <Grid item xs={12}>
              <Card>
                <SoftBox p={3} pb={1}>
                  <SoftTypography variant="h6" fontWeight="medium" color="info">
                    Danh sách Đơn hàng
                  </SoftTypography>
                </SoftBox>
                <OrderTable
                    filterValues={filterValues}
                    currentPage={currentPage}
                    pageSize={pageSize}
                    setCurrentPage={setCurrentPage}
                    setPageSize={setPageSize}
                />
              </Card>
            </Grid>
          </Grid>
        </SoftBox>
        <Footer />
      </DashboardLayout>
  );
}

export default OrderManagementPage;