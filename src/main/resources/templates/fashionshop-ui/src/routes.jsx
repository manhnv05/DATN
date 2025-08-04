import SanPham from "./layouts/admin/SanPham/sanphan";
import ThuongHieu from "./layouts/admin/SanPham/thuonghieu";
import ChatLieu from "./layouts/admin/SanPham/chatlieu";
import DanhMuc from "./layouts/admin/SanPham/danhmuc";
import KichThuoc from "./layouts/admin/SanPham/kichthuoc";
import MauSac from "./layouts/admin/SanPham/mausac";
import TayAo from "./layouts/admin/SanPham/tayao";
import CoAo from "./layouts/admin/SanPham/coao";
import HinhAnh from "./layouts/admin/SanPham/hinhanh";
import ProductForm from "./layouts/admin/SanPham/themsp";
import ProductDetailForm from "./layouts/admin/SanPham/chitiet"; // <-- Thêm import này
import GiamGia from "./layouts/admin/GiamGia";
import OrderManagementPage from "./layouts/admin/HoaDon/pages/OrderManagementPage";
import OrderDetailPage from "./layouts/admin/HoaDon/pages/OrderDetailPage";
import PhieuGiamPage from "./layouts/admin/phieugiamgia/phieugiam";
import AddPhieuGiam from "./layouts/admin/phieugiamgia/addPhieuGiam";
import UpdatePhieuGiam from "./layouts/admin/phieugiamgia/updatePhieuGiamGia";
import KhachHang from "./layouts/admin/khachhang";
import AddKhachHang from "./layouts/admin/khachhang/add";
import DetailKhachHang from "./layouts/admin/khachhang/detail";
import UpdateKhachHang from "./layouts/admin/khachhang/update";
import NhanVien from "./layouts/admin/nhanvien";
import AddNhanVien from "./layouts/admin/nhanvien/add";
import DetailNhanVien from "./layouts/admin/nhanvien/detail";
import UpdateNhanVien from "./layouts/admin/nhanvien/update";
import SalesDashboardPage from "./layouts/admin/BanHangTaiQuay/pages/SalesDashboardPage";
import DashboardStats from "./layouts/admin/thongke/thongke";
import AddDiscountEventPage from "./layouts/admin/GiamGia/AddDiscountEventPage";
import ViewDiscountEventPage from "./layouts/admin/GiamGia/ViewDiscountEventPage";

import SignIn from "./layouts/admin/authentication/sign-in";
import SignUp from "./layouts/admin/authentication/sign-up";

import Shop from "examples/Icons/Shop";
import Office from "examples/Icons/Office";
import Settings from "examples/Icons/Settings";
import Document from "examples/Icons/Document";
import SpaceShip from "examples/Icons/SpaceShip";
import CustomerSupport from "examples/Icons/CustomerSupport";
import CreditCard from "examples/Icons/CreditCard";
import Cube from "examples/Icons/Cube";


const routes = [
  {
    type: "collapse",
    name: "Thống Kê",
    key: "dashboard",
    route: "/dashboard",
    icon: <Shop size="12px" />,
    component: <DashboardStats />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Bán Hàng Tại Quầy",
    key: "sales",
    route: "/sales",
    icon: <Office size="12px" />,
    component: <SalesDashboardPage />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Quản Lý Hóa Đơn",
    key: "billing",
    route: "/OrderManagementPage",
    icon: <CreditCard size="12px" />,
    component: <OrderManagementPage />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Quản Lý Sản Phẩm",
    key: "virtual-reality",
    icon: <Cube size="12px" />,
    collapse: [
      {
        type: "item",
        name: "Sản Phẩm",
        key: "product-list",
        route: "/SanPham",
        component: <SanPham />,
        noCollapse: true,
      },
      {
        type: "item",
        name: "Thương Hiệu",
        key: "product-category",
        route: "/Brand",
        component: <ThuongHieu />,
        noCollapse: true,
      },
      {
        type: "item",
        name: "Chất Liệu",
        key: "material",
        route: "/material",
        component: <ChatLieu />,
        noCollapse: true,
      },
      {
        type: "item",
        name: "Danh Mục",
        key: "category",
        route: "/category",
        component: <DanhMuc />,
        noCollapse: true,
      },
      {
        type: "item",
        name: "Kích Thước",
        key: "size",
        route: "/size",
        component: <KichThuoc />,
        noCollapse: true,
      },
      {
        type: "item",
        name: "Màu Sắc",
        key: "color",
        route: "/color",
        component: <MauSac />,
        noCollapse: true,
      },
      {
        type: "item",
        name: "Tay Áo",
        key: "sleeve",
        route: "/sleeve",
        component: <TayAo />,
        noCollapse: true,
      },
      {
        type: "item",
        name: "Cổ Áo",
        key: "colar",
        route: "/colar",
        component: <CoAo />,
        noCollapse: true,
      },
      {
        type: "item",
        name: "Hình Ảnh",
        key: "image",
        route: "/image",
        component: <HinhAnh />,
        noCollapse: true,
      },
    ],
  },
  {
    type: "collapse",
    name: "Giảm Giá",
    key: "rtl",
    icon: <Settings size="12px" />,
    collapse: [
      {
        type: "item",
        name: "Phiếu Giảm Giá",
        key: "discount-list",
        route: "/discount",
        component: <PhieuGiamPage />,
        noCollapse: true,
      },
      {
        type: "item",
        name: "Đợt Giảm Giá",
        key: "discount-event",
        route: "/discount-event",
        component: <GiamGia />,
        noCollapse: true,
      },
    ],
  },
  {
    type: "collapse",
    name: "Quản lý Nhân Viên",
    key: "staff-management",
    route: "/staff-management",
    icon: <Office size="12px" />,
    component: <NhanVien />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Quản lý Khách Hàng",
    key: "customer-management",
    route: "/customer-management",
    icon: <Office size="12px" />,
    component: <KhachHang />,
    noCollapse: true,
  },
  { type: "title", title: "Account Pages", key: "account-pages" },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    route: "/profile",
    icon: <CustomerSupport size="12px" />,
    //component: <Profile />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    route: "/authentication/sign-in",
    icon: <Document size="12px" />,
    // component: <SignIn />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    route: "/authentication/sign-up",
    icon: <SpaceShip size="12px" />,
    // component: <SignUp />,
    noCollapse: true,
  },
  {
    type: "item",
    name: "Thêm Sản Phẩm",
    key: "add-product",
    route: "/SanPham/ThemMoi",
    component: <ProductForm />,
    noCollapse: true,
    hidden: true,
  },
  {
    type: "item",
    name: "Chi Tiết Sản Phẩm",
    key: "product-detail",
    route: "/SanPham/ChiTietSanPham/:id",
    component: <ProductDetailForm />,
    noCollapse: true,
    hidden: true,
  },
  {
    key: "discount-event-add",
    name: "Thêm đợt giảm giá",
    route: "/discount-event/add",
    component: <AddDiscountEventPage />,
    noCollapse: true,
    hidden: true,
  },
  {
    key: "discount-event-view",
    name: "Xem đợt giảm giá",
    route: "/discount-event/view",
    component: <ViewDiscountEventPage />,
    noCollapse: true,
    hidden: true,
  },
  {
    type: "item",
    name: "Thêm Phiếu giảm giá",
    key: "add-voucher",
    route: "/PhieuGiam/ThemMoi",
    component: <AddPhieuGiam />,
    noCollapse: true,
    hidden: true, // ẩn khỏi menu nếu muốn
  },
  {
    type: "item",
    name: "Update Phiếu giảm giá",
    key: "update-voucher",
    route: "/PhieuGiam/update/:id",
    component: <UpdatePhieuGiam />,
    noCollapse: true,
    hidden: true, // ẩn khỏi menu nếu muốn
  },
  {
    key: "add-customer",
    name: "Thêm khách hàng",
    route: "/khachhang/add",
    component: <AddKhachHang />,
    noCollapse: true,
    hidden: true,
  },
  {
    key: "detail-customer",
    name: "chi tiết khách hàng",
    route: "/khachhang/detail/:id",
    component: <DetailKhachHang />,
    noCollapse: true,
    hidden: true,
  },
  {
    key: "update-customer",
    name: "Cập nhật khách hàng",
    route: "/khachhang/update/:id",
    component: <UpdateKhachHang />,
    noCollapse: true,
    hidden: true,
  },
  {
    key: "add-staff",
    name: "Thêm nhân viên",
    route: "/nhanvien/add",
    component: <AddNhanVien />,
    noCollapse: true,
    hidden: true,
  },
  {
    key: "detail-staff",
    name: "chi tiêt nhân viên",
    route: "/nhanvien/detail/:id",
    component: <DetailNhanVien />,
    noCollapse: true,
    hidden: true,
  },
  {
    key: "update-staff",
    name: "cập nhật nhân viên",
    route: "/nhanvien/update/:id",
    component: <UpdateNhanVien />,
    noCollapse: true,
    hidden: true,
  },
  {
    key: "order-detail",
    name: "Hóa đơn chi tiết",
    route: "/QuanLyHoaDon/:orderId",
    component: <OrderDetailPage />,
    noCollapse: true,
    hidden: true, // ẩn khỏi menu nếu muốn
  },
];

export default routes;