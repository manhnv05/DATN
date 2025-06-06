const menuItems = {
  items: [
    {
      id: 'navigation',
      //title: 'Điều Hướng',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Thống Kê',
          type: 'item',
          icon: 'feather icon-home',
          url: '/app/dashboard/analytics'
        },
        {
          id: 'pos-sale',
          title: 'Bán Hàng Tại Quầy',
          type: 'item',
          icon: 'feather icon-shopping-cart',
          url: '/BanTaiQuay/HoaDon',
          target: false,
          breadcrumbs: true
        },
        {
          id: 'invoice-management',
          title: 'Quản Lý Hóa Đơn',
          type: 'item',
          icon: 'feather icon-file-text',
          url: '/HoaDon/QuanLyHoaDon',
          target: false,
          breadcrumbs: true
        },
        {
          id: 'component',
          title: 'Quản Lý Sản Phẩm',
          type: 'collapse',
          icon: 'feather icon-box',
          children: [
            {
              id: 'product',
              title: 'Sản Phẩm',
              type: 'item',
              url: '/SanPham/list'
            },
            {
              id: 'brand',
              title: 'Thương Hiệu',
              type: 'item',
              url: '/SanPham/thuonghieu'
            },
            {
              id: 'material',
              title: 'Chất Liệu',
              type: 'item',
              url: '/SanPham/chatlieu'
            },
            {
              id: 'category',
              title: 'Danh Mục',
              type: 'item',
              url: '/SanPham/danhmuc'
            },
            {
              id: 'size',
              title: 'Kích Thuớc',
              type: 'item',
              url: '/SanPham/size'
            },
            {
              id: 'color',
              title: 'Màu Sắc',
              type: 'item',
              url: '/SanPham/color'
            },
            {
              id: 'sleeve',
              title: 'Tay Áo',
              type: 'item',
              url: '/SanPham/sleeve'
            },
            {
              id: 'collar',
              title: 'Cổ Áo',
              type: 'item',
              url: '/SanPham/collar'
            },
            {
              id: 'image',
              title: 'Hình Ảnh',
              type: 'item',
              url: '/SanPham/image'
            }
          ]
        },
        {
          id: 'discount',
          title: 'Giảm Giá',
          type: 'collapse',
          icon: 'feather icon-tag',
          url: '',
          target: false,
          breadcrumbs: false,
          children: [
            {
              id: 'discount-list',
              title: 'Phiếu Giảm Giá',
              type: 'item',
              url: '/PhieuGiamGia/list',
              target: false,
              breadcrumbs: true
            },
            {
              id: 'discount-create',
              title: 'Đợt Giảm Giá',
              type: 'item',
              url: '/DotGiamGia/list',
              target: false,
              breadcrumbs: true
            }
          ]
        },
        {
          id: 'customer',
          title: 'Khách Hàng',
          type: 'item',
          icon: 'feather icon-user',
          url: '/KhachHang/list',
          target: false,
          breadcrumbs: true
        },
        {
          id: 'employee',
          title: 'Nhân Viên',
          type: 'item',
          icon: 'feather icon-users',
          url: '/NhanVien/list',
          target: false,
          breadcrumbs: true
        }
      ]
    }
  ]
};

export default menuItems;
