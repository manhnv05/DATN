import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
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
import ProductDetailForm from "layouts/SanPham/chitiet"; // <-- Thêm import này
import GiamGia from "layouts/GiamGia";
import OrderManagementPage from "layouts/HoaDon/pages/OrderManagementPage";
import OrderDetailPage from "layouts/HoaDon/pages/OrderDetailPage";
import PhieuGiamPage from "layouts/phieugiamgia/phieugiam";
import AddPhieuGiam from "layouts/phieugiamgia/addPhieuGiam";
import UpdatePhieuGiam from "layouts/phieugiamgia/updatePhieuGiamGia";
import KhachHang from "layouts/khachhang";




import RTL from "layouts/rtl";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";

// Soft UI Dashboard React icons
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

const routes = [
  {
    type: "collapse",
    name: "Thống Kê",
    key: "dashboard",
    route: "/dashboard",
    icon: <Shop size="12px" />,
    component: <Dashboard />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Bán Hàng Tại Quầy",
    key: "sales",
    route: "/tables",
    icon: <Office size="12px" />,
    component: <Tables />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Quản Lý Hóa Đơn",
    key: "billing",
    route: "/billing",
    icon: <CreditCard size="12px" />,
    component: <OrderManagementPage />,
    noCollapse: true,
  },
  {
    route: "/order-management/:orderId", // Đây là route khớp với đường dẫn bạn tạo
    component: <OrderDetailPage />,
    key: "order-detail",
    // Không có name/icon/type để ẩn khỏi sidebar
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
    key: "tables",
    route: "/tables",
    icon: <Office size="12px" />,
    component: <Tables />,
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
    component: <Profile />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    route: "/authentication/sign-in",
    icon: <Document size="12px" />,
    component: <SignIn />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    route: "/authentication/sign-up",
    icon: <SpaceShip size="12px" />,
    component: <SignUp />,
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
];

export default routes;