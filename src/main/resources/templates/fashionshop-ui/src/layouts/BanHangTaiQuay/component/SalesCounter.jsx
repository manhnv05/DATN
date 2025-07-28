// src/layouts/sales/components/SalesCounter.jsx

import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  IconButton,
  styled,
  Divider,
  TextField,
  Avatar,
  Checkbox,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import PaidIcon from "@mui/icons-material/Paid";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";

// Import các component chung
import SoftBox from "components/SoftBox";
import Card from "@mui/material/Card";
import SoftTypography from "components/SoftTypography";

// Import modal (điều chỉnh đường dẫn nếu cần)
import ProductSelectionModal from "./ProductSelectionModal";
import PropTypes from "prop-types";

const formatCurrency = (amount) => {
  if (typeof amount !== "number" || isNaN(amount)) {
    return "N/A";
  }
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
};

const CustomTab = styled(Tab)(({ theme }) => ({
  flexDirection: "row",
  textTransform: "none",
  width: "300px",
  flexGrow: 0,
  "&:hover": {
    backgroundColor: "rgba(73, 163, 241, 0.1)",
  },
  "& .MuiTab-wrapper": {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  "&.Mui-selected": {
    color: "#ffff !important",
    backgroundColor: "#49a3f1 !important",
  },
}));

const MAX_ORDERS = 5;

function SalesCounter({ onTotalChange, onInvoiceIdChange,onProductsChange ,completedOrderId }) {
  useEffect(() => {
    // Nếu có tín hiệu (completedOrderId có giá trị và khác null)
    if (completedOrderId) {
      // Tìm order trong state `orders` tương ứng với ID hóa đơn đã hoàn thành từ backend
      const orderToClose = orders.find(o => o.idHoaDonBackend === completedOrderId);

      // Nếu tìm thấy order, gọi hàm đóng tab đã có sẵn
      if (orderToClose) {
        handleCloseOrderTab(orderToClose.id);
      }
    }
    // useEffect này sẽ chạy mỗi khi `completedOrderId` thay đổi
  }, [completedOrderId]); 
  
  const [orders, setOrders] = useState(() => {
    try {
      const savedOrders = sessionStorage.getItem("salesOrders");
      return savedOrders ? JSON.parse(savedOrders) : [];
    } catch (error) {
      console.error("Lỗi khi đọc orders từ sessionStorage:", error);
      return [];
    }
  });
  const [selectedTab, setSelectedTab] = useState(orders.length > 0 ? orders[0].id : null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState({
    idKhachHang: 101,
    sdt: "012345673",
    ten: "Khách lẻ",
  });
  const [notes, setNotes] = useState("Khách thanh toán tiền mặt");

  const currentOrder = useMemo(
    () => orders.find((o) => o.id === selectedTab),
    [orders, selectedTab]
  );

  const totalAmount = useMemo(() => {
    if (!currentOrder) return 0;
    return currentOrder.products
      .filter((product) => product.isSelected)
      .reduce((total, product) => total + product.gia * product.quantity, 0);
  }, [currentOrder]);
  // <<< THÊM useEffect ĐỂ GỬI totalAmount LÊN COMPONENT CHA
  useEffect(() => {
    // Mỗi khi totalAmount thay đổi, gọi hàm callback đã được truyền xuống
    if (onTotalChange) {
      onTotalChange(totalAmount);
    }
  }, [totalAmount, onTotalChange]);

  useEffect(() => {
    if (orders.length === 0) {
      handleCreateOrder();
    }
  }, []);
 useEffect(() => {
    // Lấy ra id hóa đơn từ backend của order đang được chọn
    const currentInvoiceId = currentOrder?.idHoaDonBackend;

    // Nếu có hàm callback thì gọi nó với ID mới
    if (onInvoiceIdChange) {
      onInvoiceIdChange(currentInvoiceId);
    }
  }, [currentOrder, onInvoiceIdChange]);

  const handleCreateOrder = async () => {
    if (orders.length >= MAX_ORDERS) {
      alert(`Chỉ có thể tạo tối đa ${MAX_ORDERS} đơn hàng.`);
      return;
    }
    try {
      const response = await axios.post("http://localhost:8080/api/hoa-don/tao-hoa-don-cho", {
        loaiHoaDon: "Tại quầy",
      });

      const { id: idHoaDonBackend, maHoaDon: maHoaDon } = response.data.data;

      const nextId = (orders.length > 0 ? Math.max(...orders.map((o) => parseInt(o.id))) : 0) + 1;

      const newOrder = {
        id: String(nextId),
        idHoaDonBackend: idHoaDonBackend,
        name: maHoaDon || `Đơn hàng ${nextId}`,
        products: [],
      };
      console.log(idHoaDonBackend);
      setOrders((prev) => [...prev, newOrder]);
      setSelectedTab(newOrder.id);
    } catch (error) {
      console.error("Lỗi khi tạo hóa đơn chờ:", error);
      alert("Lỗi khi tạo hóa đơn chờ. Vui lòng xem console.");
    }
  };

  const handleUpdateOrder = async () => {
    if (!currentOrder || !currentOrder.idHoaDonBackend) {
      alert("Vui lòng chọn một đơn hàng hợp lệ để cập nhật.");
      return;
    }

    const danhSachCapNhat = currentOrder.products.map((p) => ({
      id: p.idChiTietSanPham,
      soLuong: p.quantity,
    }));

    try {
      await axios.post(
        `http://localhost:8080/api/hoa-don/cap-nhat-danh-sach-san-pham/${currentOrder.idHoaDonBackend}`,
        danhSachCapNhat
      );
      alert("Cập nhật đơn hàng thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật đơn hàng:", error);
      alert(`Lỗi khi cập nhật đơn hàng: ${error.response?.data?.message || "Lỗi không xác định."}`);
    }
  };

  

  useEffect(() => {
    try {
      sessionStorage.setItem("salesOrders", JSON.stringify(orders));
      if (selectedTab) {
        sessionStorage.setItem("selectedSalesTab", selectedTab);
      } else {
        sessionStorage.removeItem("selectedSalesTab");
      }
    } catch (error) {
      console.error("Lỗi khi lưu dữ liệu vào sessionStorage:", error);
    }
  }, [orders, selectedTab]);

  useEffect(() => {
    if (onProductsChange) {
      // Gửi toàn bộ danh sách sản phẩm của đơn hàng hiện tại lên component cha
      onProductsChange(currentOrder?.products || []);
    }
  }, [currentOrder, onProductsChange]);
  const handleProductSelected = (productToAdd) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === selectedTab) {
          const existingProduct = order.products.find(
            (p) => p.idChiTietSanPham === productToAdd.idChiTietSanPham
          );
          let updatedProducts;

          if (existingProduct) {
            updatedProducts = order.products.map((p) =>
              p.idChiTietSanPham === productToAdd.idChiTietSanPham
                ? { ...p, quantity: p.quantity + productToAdd.quantity }
                : p
            );
          } else {
            updatedProducts = [...order.products, { ...productToAdd, isSelected: true }];
          }
          return { ...order, products: updatedProducts };
        }
        return order;
      })
    );
    setIsProductModalOpen(false);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveProduct(productId);
      return;
    }
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === selectedTab
          ? {
              ...order,
              products: order.products.map((p) =>
                p.uniqueId === productId ? { ...p, quantity: newQuantity } : p
              ),
            }
          : order
      )
    );
  };

  const handleRemoveProduct = (productId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === selectedTab
          ? {
              ...order,
              products: order.products.filter((p) => p.uniqueId !== productId),
            }
          : order
      )
    );
  };

  const handleToggleProductSelection = (productId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === selectedTab
          ? {
              ...order,
              products: order.products.map((p) =>
                p.uniqueId === productId ? { ...p, isSelected: !p.isSelected } : p
              ),
            }
          : order
      )
    );
  };

  const handleToggleAllProducts = (shouldSelectAll) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === selectedTab
          ? {
              ...order,
              products: order.products.map((p) => ({ ...p, isSelected: shouldSelectAll })),
            }
          : order
      )
    );
  };

  const isAllSelected = currentOrder
    ? currentOrder.products.length > 0 && currentOrder.products.every((p) => p.isSelected)
    : false;
  const isSomeSelected = currentOrder
    ? currentOrder.products.some((p) => p.isSelected) && !isAllSelected
    : false;

 const handleCloseOrderTab = (idToClose) => {
    const orderToCloseIndex = orders.findIndex((order) => order.id === idToClose);
    if (orderToCloseIndex === -1) return;

    // Lọc bỏ tab cần đóng
    const newOrders = orders.filter((order) => order.id !== idToClose);
    setOrders(newOrders);

    // Xử lý việc chuyển tab sau khi đóng
    if (selectedTab === idToClose) {
      if (newOrders.length === 0) {
        // Nếu không còn tab nào, không chọn tab nào cả
        setSelectedTab(null);
        // Có thể gọi handleCreateOrder() ở đây nếu bạn muốn luôn có ít nhất 1 tab
      //  handleCreateOrder(); 
      } else {
        // Chọn tab đầu tiên làm tab mặc định sau khi đóng
        setSelectedTab(newOrders[0].id);
      }
    }
  };

  return (
    <>
      <Card>
        <SoftBox p={2}>
          {/* ... Phần header và tabs ... */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <SoftTypography variant="h6" fontWeight="medium">
              Hóa đơn
            </SoftTypography>
            <Button
              variant="contained"
              color="info"
              startIcon={<AddIcon />}
              onClick={handleCreateOrder}
              disabled={orders.length >= MAX_ORDERS}
            >
              Tạo đơn
            </Button>
          </Box>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={selectedTab}
              onChange={(e, val) => setSelectedTab(val)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTabs-flexContainer": {
                  justifyContent: "flex-start",
                },
              }}
            >
              {orders.map((order) => (
                <CustomTab
                  key={order.id}
                  value={order.id}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Typography variant="body2">{order.name}</Typography>
                       
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCloseOrderTab(order.id);
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      
                    </Box>
                  }
                />
              ))}
            </Tabs>
          </Box>

          {/* Phần Sản phẩm */}
          <SoftBox mt={2}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
                py: 1.5,
                borderBottom: "1px solid #f0f2f5",
              }}
            >
              <SoftTypography variant="h6" fontWeight="medium" color="text">
                ■ Sản phẩm
              </SoftTypography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<QrCodeScannerIcon />}
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
                >
                  QUÉT QR SẢN PHẨM
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => setIsProductModalOpen(true)}
                  disabled={!selectedTab}
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
                >
                  THÊM SẢN PHẨM
                </Button>
              </Box>
            </Box>

            <Box sx={{ minHeight: "300px", display: "flex", flexDirection: "column", mt: 2 }}>
              {currentOrder ? (
                currentOrder.products.length > 0 ? (
                  <>
                    {/* Header bảng sản phẩm */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        px: 2,
                        py: 1,
                        borderBottom: "2px solid #ddd",
                        backgroundColor: "#f9f9f9",
                      }}
                    >
                      <Box sx={{ width: "5%" }}>
                        <Checkbox
                          checked={isAllSelected}
                          indeterminate={isSomeSelected}
                          onChange={(e) => handleToggleAllProducts(e.target.checked)}
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Sản phẩm
                        </Typography>
                      </Box>
                      <Box sx={{ width: "15%", display: "flex", justifyContent: "center" }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Số lượng
                        </Typography>
                      </Box>
                      <Box sx={{ width: "15%", display: "flex", justifyContent: "flex-end" }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Thành tiền
                        </Typography>
                      </Box>
                      <Box sx={{ width: "10%", display: "flex", justifyContent: "flex-end" }} />
                    </Box>

                    {/* Danh sách sản phẩm */}
                    <Box sx={{ flexGrow: 1, overflow: "auto", pr: 1 }}>
                      {currentOrder.products.map((product) => (
                        <Box
                          key={product.uniqueId}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            py: 2,
                            borderBottom: "1px solid #f0f2f5",
                            opacity: product.isSelected ? 1 : 0.5,
                            px: 2,
                          }}
                        >
                          {/* Cột 1: Checkbox */}
                          <Box sx={{ width: "5%" }}>
                            <Checkbox
                              checked={product.isSelected}
                              onChange={() => handleToggleProductSelection(product.uniqueId)}
                            />
                          </Box>

                          {/* Cột 2: Thông tin sản phẩm */}
                          <Box sx={{ flex: 1, display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar
                              variant="rounded"
                              src={product.duongDanAnh}
                              sx={{ width: 60, height: 60 }}
                            />
                            <Box>
                              <Typography variant="subtitle1" fontWeight="medium">
                                {product.tenSanPham}
                              </Typography>
                              {product.giaGoc && (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ textDecoration: "line-through" }}
                                >
                                  {formatCurrency(product.giaGoc)}
                                </Typography>
                              )}
                            
                                <Typography variant="body2" color="text.secondary">
                                Màu: {product.mauSac}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                size: {product.kichThuoc}
                              </Typography>
                                <Typography variant="body1" color="error.main" fontWeight="bold">
                                {formatCurrency(product.gia)}
                              </Typography>
                            </Box>
                          </Box>

                          {/* Cột 3: Số lượng */}
                          <Box sx={{ width: "15%", display: "flex", justifyContent: "center" }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                border: "1px solid #ccc",
                                borderRadius: "999px",
                              }}
                            >
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleUpdateQuantity(product.uniqueId, product.quantity - 1)
                                }
                                sx={{ color: "text.secondary" }}
                              >
                                <RemoveIcon fontSize="small" />
                              </IconButton>
                              <Typography
                                variant="body1"
                                sx={{
                                  px: 1.5,
                                  fontWeight: "medium",
                                  borderLeft: "1px solid #ccc",
                                  borderRight: "1px solid #ccc",
                                }}
                              >
                                {product.quantity}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleUpdateQuantity(product.uniqueId, product.quantity + 1)
                                }
                                sx={{ color: "text.secondary" }}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>

                          {/* Cột 4: Thành tiền */}
                          <Box sx={{ width: "15%", textAlign: "right" }}>
                            <Typography variant="h6" fontWeight="bold">
                              {formatCurrency(product.gia * product.quantity)}
                            </Typography>
                          </Box>

                          {/* Cột 5: Nút xóa */}
                          <Box sx={{ width: "10%", textAlign: "right" }}>
                            <IconButton
                              color="error"
                              onClick={() => handleRemoveProduct(product.uniqueId)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      ))}
                    </Box>

                    {/* Phần tổng tiền và thanh toán */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        mt: 2,
                        pt: 2,
                        borderTop: "1px solid #ddd",
                      }}
                    >
                      <Typography variant="h6">Tổng tiền (các mục đã chọn):</Typography>
                      <Typography
                        variant="h6"
                        color="error"
                        fontWeight="bold"
                        sx={{ ml: 2, minWidth: "180px", textAlign: "right" }}
                      >
                        {formatCurrency(totalAmount)}
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ m: "auto", textAlign: "center" }}>
                    <ShoppingCartIcon sx={{ fontSize: "3rem", color: "grey.400", mb: 1 }} />
                    <SoftTypography variant="body2" color="text.secondary">
                      Chưa có sản phẩm trong đơn hàng này.
                    </SoftTypography>
                  </Box>
                )
              ) : (
                <Box sx={{ m: "auto", textAlign: "center" }}>
                  <SoftTypography variant="h6" color="text.secondary">
                    Vui lòng chọn hoặc tạo một đơn hàng
                  </SoftTypography>
                </Box>
              )}
            </Box>
          </SoftBox>

          <Divider sx={{ my: 3 }} />
        </SoftBox>
      </Card>
      {/* Modal chọn sản phẩm */}
      {isProductModalOpen && (
        <ProductSelectionModal
          open={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          onSelectProduct={handleProductSelected}
        />
      )}
    </>
  );
}

SalesCounter.propTypes = {
  onTotalChange: PropTypes.func,
   onInvoiceIdChange: PropTypes.func.isRequired, 
     onProductsChange: PropTypes.func.isRequired,
     completedOrderId: PropTypes.number,
};

export default SalesCounter;
