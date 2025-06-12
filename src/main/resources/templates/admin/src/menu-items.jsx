const menuItems = {
  items: [
    {
      id: 'main-navigation',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        // Tổng quan
        {
          id: 'dashboard',
          title: 'Thống Kê',
          type: 'item',
          icon: 'feather icon-home text-primary',
          url: '/app/dashboard/analytics'
        },

        // Bán hàng
        {
          id: 'pos-sale',
          title: 'Bán Hàng Tại Quầy',
          type: 'item',
          icon: 'feather icon-shopping-cart text-primary',
          url: '/BanTaiQuay/HoaDon'
        },
        {
          id: 'invoice-management',
          title: 'Quản Lý Hóa Đơn',
          type: 'item',
          icon: 'feather icon-file-text text-primary',
          url: '/HoaDon/QuanLyHoaDon'
        },

        // Quản lý sản phẩm
        {
          id: 'product-management',
          title: 'Quản Lý Sản Phẩm',
          type: 'collapse',
          icon: 'feather icon-box text-primary',
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
              title: 'Kích Thước',
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

        // Khuyến mãi
        {
          id: 'discount-management',
          title: 'Giảm Giá',
          type: 'collapse',
          icon: 'feather icon-tag text-primary',
          children: [
            {
              id: 'discount-voucher',
              title: 'Phiếu Giảm Giá',
              type: 'item',
              url: '/PhieuGiamGia/list'
            },
            {
              id: 'discount-campaign',
              title: 'Đợt Giảm Giá',
              type: 'item',
              url: '/DotGiamGia/list'
            }
          ]
        },

        // Quản lý người dùng
        {
          id: 'customer',
          title: 'Khách Hàng',
          type: 'item',
          icon: 'feather icon-user text-primary',
          url: '/KhachHang/list'
        },
        {
          id: 'employee',
          title: 'Nhân Viên',
          type: 'item',
          icon: 'feather icon-users text-primary',
          url: '/NhanVien/list'
        }
      ]
    }
  ]
};

export default menuItems;
