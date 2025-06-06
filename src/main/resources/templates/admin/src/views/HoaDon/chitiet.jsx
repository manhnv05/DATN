import React, { useState } from 'react';
import { Button, Table, Badge, Breadcrumb } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Sử dụng useNavigate để quay lại
import { BsArrowLeft } from 'react-icons/bs';

import step1 from '../../assets/images/step1.png';
import step2 from '../../assets/images/step2.png';
import step3 from '../../assets/images/step3.png';
import step4 from '../../assets/images/step4.png';
import step5 from '../../assets/images/step5.png';
import step6 from '../../assets/images/step6.png';

const steps = [
  { label: 'Tạo đơn hàng', icon: step1, color: '#7ed957' },
  { label: 'Chờ xác nhận', icon: step2, color: '#7ed957' },
  { label: 'Chuẩn bị giao', icon: step3, color: '#ffd966' },
  { label: 'Đang vận chuyển', icon: step4, color: '#ff6f6f' },
  { label: 'Đã giao hàng', icon: step5, color: '#ffd966' },
  { label: 'Đã giao tiền', icon: step6, color: '#ffd966' }
];

const InvoiceDetail = () => {
  //   const { id } = useParams();
  const [showDetail, setShowDetail] = useState(false);
  const navigate = useNavigate(); // Khởi tạo hook

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center mb-3">
        <Button variant="secondary" size="sm" className="me-2" onClick={() => navigate(-1)}>
          <BsArrowLeft />
        </Button>
        <Breadcrumb style={{ userSelect: 'none' }}>
          <Breadcrumb.Item href="#">Trang Chủ</Breadcrumb.Item>
          <Breadcrumb.Item active>Quản Lý Hóa Đơn</Breadcrumb.Item>
          <Breadcrumb.Item active>Chi tiết Hóa Đơn</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      {/* Progress Steps */}
      <div className="mb-4 bg-white border rounded p-3 shadow-sm" style={{ userSelect: 'none' }}>
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-2" style={{ minHeight: 110, position: 'relative' }}>
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="d-flex flex-column align-items-center flex-fill"
              style={{
                position: 'relative',
                minWidth: 80,
                flex: 1,
                maxWidth: 'calc(100% / 6)'
              }}
            >
              {/* Connector bar with arrow */}
              {idx !== steps.length - 1 && (
                <div
                  style={{
                    width: '100%',
                    height: 24,
                    position: 'absolute',
                    top: 38,
                    left: 0,
                    zIndex: 0,
                    pointerEvents: 'none'
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: 18,
                      background: `linear-gradient(to right, ${step.color} 80%, ${steps[idx + 1].color} 100%)`,
                      clipPath: 'polygon(0 0, 95% 0, 100% 50%, 95% 100%, 0 100%, 5% 50%)'
                    }}
                  />
                </div>
              )}

              {/* Circle with icon */}
              <div
                style={{
                  background: '#fff',
                  borderRadius: '50%',
                  border: `4px solid ${step.color}`,
                  width: 56,
                  height: 56,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1,
                  boxShadow: '0 2px 8px #0001',
                  marginBottom: 8
                }}
              >
                <img src={step.icon} alt={step.label} style={{ width: 36, height: 36 }} />
              </div>

              {/* Step label */}
              <div style={{ fontSize: 13, marginTop: 2, textAlign: 'center', minHeight: 32, wordBreak: 'break-word' }}>{step.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="d-flex flex-wrap gap-2 mb-4">
        <Button variant="success">Xác nhận đã lấy hàng</Button>
        <Button variant="danger">Hủy đơn</Button>
        <Button variant="primary" className="ms-auto" onClick={() => setShowDetail(!showDetail)}>
          {showDetail ? 'Ẩn chi tiết' : 'Chi tiết'}
        </Button>
      </div>

      {/* Responsive Detail Sections */}
      {showDetail && (
        <div className="row g-4">
          {/* Left: Order Info + Tổng kết */}
          <div className="col-12 col-lg-5">
            {/* Thông tin đơn hàng */}
            <div className="border rounded p-3 mb-4 bg-white shadow-sm" style={{ userSelect: 'none' }}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0 text-primary">Thông tin đơn hàng</h6>
                <Button variant="outline-primary" size="sm">
                  Cập nhật
                </Button>
              </div>
              <div className="mb-2">
                <strong>Mã:</strong>
                HD13
              </div>
              <div className="mb-2">
                <strong>Tên khách hàng:</strong>
                Nguyễn Đức
              </div>
              <div className="mb-2">
                <strong>Trạng thái:</strong> <span className="text-danger">Đang vận chuyển</span>
              </div>
              <div className="mb-2">
                <strong>Số điện thoại:</strong>
                0961119688
              </div>
              <div>
                <strong>Loại:</strong>
                Giao hàng
              </div>
            </div>
            {/* Tổng kết */}
            <div className="border rounded p-3 bg-white shadow-sm" style={{ userSelect: 'none' }}>
              <h6 className="mb-3 text-primary">Tổng kết</h6>
              <div className="mb-2">
                <strong>Phiếu giảm giá:</strong> ABC
              </div>
              <div className="mb-2">
                <strong>Giảm từ cửa hàng:</strong> 0 VND
              </div>
              <hr />
              <div className="mb-2">
                <strong>Tổng tiền hàng:</strong> 400.000 VND
              </div>
              <div className="mb-2">
                <strong>Phí vận chuyển:</strong> 0 VND
              </div>
              <div>
                <strong>Thành tiền:</strong> <span className="text-danger">400.000 VND</span>
              </div>
            </div>
          </div>

          {/* Right: Product List, Lịch sử thanh toán */}
          <div className="col-12 col-lg-7" style={{ userSelect: 'none' }}>
            {/* Danh sách sản phẩm */}
            <div
              className="border rounded p-3 bg-white shadow-sm mb-4 mb-lg-3"
              style={{ maxHeight: 600, minHeight: 300, overflowY: 'auto' }}
            >
              <h6 className="mb-3 text-primary">Danh sách sản phẩm</h6>
              <div className="table-responsive mb-0">
                <Table bordered size="sm" className="mb-0">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Sản Phẩm</th>
                      <th>Số Lượng</th>
                      <th>Đơn Giá</th>
                      <th>Thành Tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>SWE VISION TEE - CREAM</td>
                      <td>2</td>
                      <td>100.000 VND</td>
                      <td className="text-danger">200.000 VND</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>SWE VISION TEE - CREAM</td>
                      <td>2</td>
                      <td>100.000 VND</td>
                      <td className="text-danger">200.000 VND</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
            {/* Lịch sử thanh toán */}
            <div className="border rounded p-3 bg-white shadow-sm">
              <h6 className="mb-3 text-primary">Lịch sử thanh toán</h6>
              <div className="table-responsive">
                <Table striped bordered hover size="sm" className="mb-0">
                  <thead>
                    <tr>
                      <th>Số tiền</th>
                      <th>Thời gian</th>
                      <th>PTTT</th>
                      <th>Trạng thái</th>
                      <th>Ghi chú</th>
                      <th>Nhân viên xác nhận</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>400.000 VND</td>
                      <td>02/06/2025 10:34:12</td>
                      <td>
                        <a href="#">Tiền mặt</a>
                      </td>
                      <td>
                        <Badge bg="success">Thành công</Badge>
                      </td>
                      <td>OK</td>
                      <td>Nguyễn Công Hoan</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetail;
