
import SanPham from "layouts/SanPham/sanphan";
import ThuongHieu from "layouts/SanPham/thuonghieu";
import ChatLieu from "layouts/SanPham/chatlieu";
import DanhMuc from "layouts/SanPham/danhmuc";
import KichThuoc from "layouts/SanPham/kichthuoc";
import MauSac from "layouts/SanPham/mausac";
import TayAo from "layouts/SanPham/tayao";
import CoAo from "layouts/SanPham/coao";
import HinhAnh from "layouts/SanPham/hinhanh";
import ProductForm from "layouts/SanPham/themsp";
import ProductDetailForm from "layouts/SanPham/chitiet"; 
import GiamGia from "layouts/GiamGia";
import OrderManagementPage from "layouts/HoaDon/pages/OrderManagementPage";
import OrderDetailPage from "layouts/HoaDon/pages/OrderDetailPage";
import PhieuGiamPage from "layouts/phieugiamgia/phieugiam";
import AddPhieuGiam from "layouts/phieugiamgia/addPhieuGiam";
import UpdatePhieuGiam from "layouts/phieugiamgia/updatePhieuGiamGia";
import KhachHang from "layouts/khachhang";
import AddKhachHang from "layouts/khachhang/add";
import NhanVien from "layouts/nhanvien";
import AddNhanVien from "layouts/nhanvien/add";
import DetailNhanVien from "layouts/nhanvien/detail";
import UpdateNhanVien from "layouts/nhanvien/update";

import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

import Shop from "examples/Icons/Shop";
import Office from "examples/Icons/Office";
import Settings from "examples/Icons/Settings";
import Document from "examples/Icons/Document";
import SpaceShip from "examples/Icons/SpaceShip";
import CustomerSupport from "examples/Icons/CustomerSupport";
import CreditCard from "examples/Icons/CreditCard";
import Cube from "examples/Icons/Cube";
import AddDiscountEventPage from "layouts/GiamGia/AddDiscountEventPage";
import ViewDiscountEventPage from "layouts/GiamGia/ViewDiscountEventPage";
import DashboardStats from "layouts/thongke/thongke";
import SalesDashboardPage from "layouts/BanHangTaiQuay/pages/SalesDashboardPage";

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
    route: "/tables",
    icon: <Office size="12px" />,
    component: <SalesDashboardPage />,
    noCollapse: true,
  },

 
  {
  type: "collapse",
  name: "Quản Lý Hóa Đơn",
  key: "order-management",
  route: "/QuanLyHoaDon",
  icon: <CreditCard size="12px" />,
  component: <OrderManagementPage />,
  noCollapse: true,
}
,
  {
    name: "Hóa đơn chi tiết",
    route: "/QuanLyHoaDon/:orderId",
    component: <OrderDetailPage />,
    key: "order-detail",
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
        route: "/PhieuGiam",
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
    // component: <Profile />,
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
];

export default routes;