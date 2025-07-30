import React, { useCallback } from 'react'; // Chỉ cần useCallback nếu không dùng useState/useEffect
import styles from './OrderInfo.module.css';
import PropTypes from 'prop-types';

// Hàm helper để định nghĩa màu cho trạng thái (sử dụng Bootstrap badge classes)
// Nếu bạn muốn màu tùy chỉnh, hãy định nghĩa chúng trong OrderInfo.module.css và trả về styles[className]
const getStatusBadgeClassName = (status) => {
  switch (status) {
    case 'Hoàn thành': return 'bg-success';
    case 'Đang vận chuyển': return 'bg-warning';
    case 'Đã xác nhận': return 'bg-success';
    case 'Chờ giao hàng': return 'bg-warning';
    case 'Chờ xác nhận': return 'bg-warning';
    case 'Tạo đơn hàng': return 'bg-success';
    case 'Hủy': return 'bg-danger';
    default: return 'bg-success';
  }
};



const getOrderTypeBadgeClassName = (type) => {
    const lowerCaseType = type ? type.toLowerCase() : '';
    if (lowerCaseType === 'online' || lowerCaseType === 'trực tuyến') {
        return 'bg-primary'; // Bootstrap light blue
    }
    if (lowerCaseType === 'at_counter' || lowerCaseType === 'tại quầy') { 
        return 'bg-success'; 
    }
    return 'bg-secondary'; 
};

const OrderInfo = ({ order }) => {
   
    console.log("OrderInfo order:", order.status);
    const formatDateTime = useCallback((isoString) => {
        if (!isoString) return 'Chưa cập nhật';
        const date = new Date(isoString);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const day = date.getDate();
        const month = date.getMonth() + 1; 
        const year = date.getFullYear();
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

        const pad = (num) => num.toString().padStart(2, '0');

        
        return `${pad(formattedHours)}:${pad(minutes)}:${pad(seconds)}  ${pad(day)}/${pad(month)}/${year}`;
    }, []); 


    const pad = useCallback((num) => num.toString().padStart(2, '0'), []);
    return (
        <div className="card mb-4"> 
            <div className="card-body">
                <div className="row mb-3">
                    <div className="col-md-6 col-12 mb-2">
                        <strong>Mã hóa đơn:</strong> {order.maHoaDon}
                    </div>
                    <div className="col-md-6 col-12 mb-2">
                        <strong>Ngày tạo:</strong> {formatDateTime(order.ngayTao)}
                    </div>
                      <div className="col-md-6 col-12 mb-2">
                        <strong>Nhân viên tạo đơn hàng:</strong> {order.StaffName}
                    </div>
                    <div className="col-md-6 col-12 mb-2">
                        <strong>Trạng thái:</strong>
                       <span className={`${styles.softBadge} ${styles[getStatusBadgeClassName(order.status)]}`}>
  {order.status}
</span>

                    </div>
                </div>

                <hr className="my-3" /> 

               

              
             <h6 className="mb-3 fs-6 fw-bold" style={{ color: "#6ea8fe" }}>
  Thông tin người nhận
</h6>
                <div className="row mb-3">
                    <div className="col-md-6 col-12 mb-2">
                        <strong>Tên người nhận:</strong> {order.receiverName}
                    </div>
                    <div className="col-md-6 col-12 mb-2">
                        <strong>SĐT người nhận:</strong> {order.phoneNumber}
                    </div>
                    <div className="col-6">
                        <strong>Loại:</strong>{' '}
                <span className={`${styles.softBadge} ${styles[getOrderTypeBadgeClassName(order.type)]}`}>
             
              {order.type && (order.type.toLowerCase() === 'online' || order.type.toLowerCase() === 'trực tuyến')
                ? 'Trực tuyến'
                : (order.type && (order.type.toLowerCase() === 'at_counter' || order.type.toLowerCase() === 'tại quầy')
                  ? 'Tại quầy'
                  : order.type)}
            </span>
                    </div>
                    <div className="col-md-6 col-12 mb-2">
                        <strong>Địa chỉ:</strong> {order.diaChi}
                    </div>
                </div>

              

            </div> 
        </div> 
    );
};
OrderInfo.propTypes = {
  order: PropTypes.shape({
    maHoaDon: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    ngayTao: PropTypes.string.isRequired,
    StaffName: PropTypes.string,
    status: PropTypes.string.isRequired,
    receiverName: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    diaChi: PropTypes.string.isRequired,
  }).isRequired,
};
export default OrderInfo;