import React, { Suspense, Fragment, lazy } from 'react';
import { Routes, Navigate, Route } from 'react-router-dom';

// project import
import Loader from './components/Loader/Loader';
import AdminLayout from './layouts/AdminLayout';

import { BASE_URL } from './config/constant';

// ==============================|| ROUTES ||============================== //

const renderRoutes = (routes = []) => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {routes.map((route, i) => {
        const Guard = route.guard || Fragment;
        const Layout = route.layout || Fragment;
        const Element = route.element;

        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            element={
              <Guard>
                <Layout>{route.routes ? renderRoutes(route.routes) : <Element props={true} />}</Layout>
              </Guard>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

export const routes = [
  {
    exact: 'true',
    path: '/auth/signup-1',
    element: lazy(() => import('./views/auth/signup/SignUp1'))
  },
  {
    exact: 'true',
    path: '/auth/signin-1',
    element: lazy(() => import('./views/auth/signin/SignIn1'))
  },
  {
    exact: 'true',
    path: '/auth/reset-password-1',
    element: lazy(() => import('./views/auth/reset-password/ResetPassword1'))
  },
  {
    path: '*',
    layout: AdminLayout,
    routes: [
      {
        exact: 'true',
        path: '/app/dashboard/analytics',
        element: lazy(() => import('./views/dashboard'))
      },
      {
        exact: 'true',
        path: '/BanTaiQuay/HoaDon',
        element: lazy(() => import('./views/BanTaiQuay'))
      },
      {
        exact: 'true',
        path: '/HoaDon/QuanLyHoaDon',
        element: lazy(() => import('./views/HoaDon'))
      },
      {
        exact: 'true',
        path: '/HoaDon/ChiTiet/:mahoadon',
        element: lazy(() => import('./views/HoaDon/chitiet'))
      },
      {
        exact: 'true',
        path: '/PhieuGiamGia/list',
        element: lazy(() => import('./views/GiamGia/phieugg'))
      },
      {
        exact: 'true',
        path: '/DotGiamGia/list',
        element: lazy(() => import('./views/GiamGia/dotgg'))
      },
      {
        exact: 'true',
        path: '/KhachHang/list',
        element: lazy(() => import('./views/KhachHang'))
      },
      {
        exact: 'true',
        path: '/NhanVien/list',
        element: lazy(() => import('./views/NhanVien'))
      },
      {
        exact: 'true',
        path: '/SanPham/list',
        element: lazy(() => import('./views/SanPham/sanphan'))
      },
      {
        exact: 'true',
        path: '/SanPham/ThemMoi',
        element: lazy(() => import('./views/SanPham/themsp'))
      },
      {
        exact: 'true',
        path: '/SanPham/thuonghieu',
        element: lazy(() => import('./views/SanPham/thuonghieu'))
      },
      {
        exact: 'true',
        path: '/SanPham/chatlieu',
        element: lazy(() => import('./views/SanPham/chatlieu'))
      },
      {
        exact: 'true',
        path: '/SanPham/danhmuc',
        element: lazy(() => import('./views/SanPham/danhmuc'))
      },

      {
        exact: 'true',
        path: '/SanPham/size',
        element: lazy(() => import('./views/SanPham/kichthuoc'))
      },
      {
        exact: 'true',
        path: '/SanPham/color',
        element: lazy(() => import('./views/SanPham/mausac'))
      },
      {
        exact: 'true',
        path: '/SanPham/sleeve',
        element: lazy(() => import('./views/SanPham/tayao'))
      },
      {
        exact: 'true',
        path: '/SanPham/collar',
        element: lazy(() => import('./views/SanPham/coao'))
      },
      {
        exact: 'true',
        path: '/SanPham/image',
        element: lazy(() => import('./views/SanPham/hinhanh'))
      },
      {
        exact: 'true',
        path: '/sample-page',
        element: lazy(() => import('./views/extra/SamplePage'))
      },
      {
        path: '*',
        exact: 'true',
        element: () => <Navigate to={BASE_URL} />
      }
    ]
  }
];

export default renderRoutes;
