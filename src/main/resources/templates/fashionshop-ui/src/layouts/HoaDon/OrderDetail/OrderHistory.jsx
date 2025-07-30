// src/components/OrderDetail/OrderHistory/OrderHistory.jsx

import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from "prop-types";
// === IMPORT TỪ MUI ===
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

// === IMPORT ẢNH (giữ nguyên) ===
import tao_hoa_don_img from '../../../assets/images/tao_hoa_don.png';
import cho_xac_nhan from '../../../assets/images/cho_xac_nhan.png';
import cho_giao_hang from '../../../assets/images/cho_giao_hang.png';
import dang_giao_hang from '../../../assets/images/dang_giao_hang.png';
import hoan_thanh from '../../../assets/images/hoan_thanh.png';
import Huy from '../../../assets/images/Huy.png';
import da_xac_nhan from '../../../assets/images/DaXacNhan.png';
import { toast} from "react-toastify";


const OrderHistory = ({ orderId }) => {
  // === STATE MANAGEMENT VÀ HELPERS (GIỮ NGUYÊN HOÀN TOÀN) ===
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDateTime = useCallback((isoString) => {
    if (!isoString) return 'Chưa cập nhật';
    const date = new Date(isoString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const ampm = hours >= 12 ? 'CH' : 'SA';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const pad = (num) => num.toString().padStart(2, '0');
    return `${pad(formattedHours)}:${pad(minutes)}:${pad(seconds)} ${ampm} ${pad(day)}/${pad(month)}/${year}`;
  }, []);

  const mapStatusToDisplay = useCallback((apiStatus, apiDate) => {
    let displayStatus = '';
    let className = '';
     const trimmedStatus = apiStatus ? apiStatus.trim() : '';
    switch (trimmedStatus) { // Sử dụng biến đã được trim
      case 'Tạo đơn hàng': displayStatus = 'Tạo đơn hàng'; className = 'TAO_DON_HANG'; break;
      case 'Chờ xác nhận': displayStatus = 'Chờ xác nhận'; className = 'CHO_XAC_NHAN'; break;
    case 'Đã xác nhận':
        displayStatus = 'Đã xác nhận'; // Gán giá trị không có khoảng trắng
        className = 'DA_XAC_NHAN';      // Gán đúng className
        break;
      case 'Chờ giao hàng': displayStatus = 'Chờ giao hàng'; className = 'CHO_GIAO_HANG'; break;
      case 'Đang vận chuyển': displayStatus = 'Đang vận chuyển'; className = 'DANG_VAN_CHUYEN'; break;
      case 'Hoàn thành': displayStatus = 'Hoàn thành'; className = 'HOAN_THANH'; break;
      case 'Hủy': displayStatus = 'Hủy'; className = 'HUY'; break;
      default: displayStatus = apiStatus; className = 'DA_XAC_NHAN';
    }
    return { status: displayStatus, date: apiDate, formattedDate: formatDateTime(apiDate), className: className };
  }, [formatDateTime]);

  const getIconComponent = useCallback((className) => {
    const imgStyle = { width: '100%', height: '100%', objectFit: 'contain' };
    switch (className) {
      case 'TAO_DON_HANG': return <img src={tao_hoa_don_img} alt="Tạo đơn" style={imgStyle} />;
       case 'DA_XAC_NHAN': return <img src={da_xac_nhan} alt="Đã xác nhận" style={imgStyle} />;
      case 'CHO_XAC_NHAN': return <img src={cho_xac_nhan} alt="Chờ xác nhận" style={imgStyle} />;
      case 'CHO_GIAO_HANG': return <img src={cho_giao_hang} alt="Chờ giao hàng" style={imgStyle} />;
      case 'DANG_VAN_CHUYEN': return <img src={dang_giao_hang} alt="Đang giao" style={imgStyle} />;
      case 'HOAN_THANH': return <img src={hoan_thanh} alt="Hoàn thành" style={imgStyle} />;
      case 'HUY': return <img src={Huy} alt="Hoàn thành" style={imgStyle} />;
      default: return null;
    }
  }, []);

  const fetchOrderHistory = useCallback(async () => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/api/hoa-don/lich-su/${orderId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      console.log("Dữ liệu lịch sử từ API:", data);
      const transformedData = [...data]
          .sort((a, b) => new Date(a.thoiGian) - new Date(b.thoiGian))
          .map(item => mapStatusToDisplay(item.trangThaiHoaDon, item.thoiGian));
           console.log("Dữ liệu đã biến đổi để render:", transformedData);
      setHistoryData(transformedData);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [orderId, mapStatusToDisplay]);

  useEffect(() => {
    fetchOrderHistory();
  }, [fetchOrderHistory]);

  // === LOGIC TÍNH TOÁN ĐƯỜNG KẺ (GIỮ NGUYÊN HOÀN TOÀN) ===
  const totalItems = historyData.length;
  let actualLastActiveIndex = -1;
  for (let i = historyData.length - 1; i >= 0; i--) {
    if (historyData[i].date) { // Chỉ cần check có date là active
      actualLastActiveIndex = i;
      break;
    }
  }

  let activeLineLeft = 0;
  let activeLineWidth = 0;

  if (totalItems > 1) {
    const itemWidthPercentage = 100 / (totalItems -1);
    activeLineLeft = 0;
    if (actualLastActiveIndex > 0) {
      activeLineWidth = (actualLastActiveIndex / (totalItems - 1)) * 100;
    }
  }

  // === RENDER LOADING / ERROR / EMPTY STATE (Dùng MUI) ===
  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ m: 2 }}>Lỗi: {error.message}</Alert>;
  if (historyData.length === 0) return <Typography sx={{ textAlign: 'center', p: 3 }}>Chưa có lịch sử trạng thái.</Typography>;



  return (
      <Box
          sx={{
            display: 'flex',
            justifyContent: 'center', // Căn giữa toàn bộ container
            alignItems: 'center', // Căn chỉnh các item theo chiều dọc
            width: '100%', // Đảm bảo container chiếm hết chiều rộng
            p: 2, // Padding cho container tổng
            position: 'relative',
          }}
      >
        {/* Container chứa các item và đường kẻ */}
        <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around', // Thay đổi ở đây: dùng 'space-around' hoặc 'gap'
              alignItems: 'center', // Đảm bảo các item con được căn giữa theo chiều dọc
              width: '100%', // Đảm bảo chiếm toàn bộ chiều rộng
              position: 'relative',
              padding: '0 20px', // Thêm padding ngang để đường kẻ không chạm mép
              zIndex: 3, // Đảm bảo các item nằm trên đường kẻ
            }}
        >
          {/* Đường kẻ nền màu xám */}
          {totalItems > 1 && (
              <Box
                  sx={{
                    position: 'absolute',
                    top: '47px', // Vị trí của đường kẻ theo chiều dọc (căn giữa icon)
                    left: '20px', // Bắt đầu sau padding
                    right: '20px', // Kết thúc trước padding
                    height: '4px',
                    backgroundColor: '#6ea8fe', // Màu từ theme MUI
                    zIndex: 1,
                  }}
              />
          )}
          {historyData.map((item, index) => {
            const isActive = index <= actualLastActiveIndex;
            return (
                <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      zIndex: 2, // Đảm bảo mỗi item riêng lẻ nằm trên đường kẻ
                    }}
                >
                  {/* NEW Outer Box for Border */}
                  <Box
                      sx={{
                        borderRadius: '50%',
                        border: `3px solid ${isActive ? '#6ea8fe' : '#E0E0E0'}`, // Thay đổi màu viền dựa trên trạng thái active
                        padding: '5px',
                        display: 'flex',
                        width: 90,
                        height: 90,
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'border-color 0.5s ease-in-out',
                        backgroundColor: '#F0F8FF',
                        zIndex: 3,
                      }}
                  >
                    {/* Original Icon Wrapper - now inside the new Outer Box */}
                    <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                    >
                      {getIconComponent(item.className)}
                    </Box>
                  </Box>
                  {/* Content */}
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {item.status}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.formattedDate}
                    </Typography>
                  </Box>
                </Box>
            );
          })}
        </Box>
      </Box>
  );
};

OrderHistory.propTypes = {
  orderId: PropTypes.string.isRequired, // Giả sử orderId là một chuỗi và là bắt buộc
};

export default OrderHistory;