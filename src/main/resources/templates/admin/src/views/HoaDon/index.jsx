import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Table, Button, Form, InputGroup, Pagination, Badge, Dropdown } from 'react-bootstrap';
import { FaCalendarAlt, FaPlus, FaQrcode } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const invoices = [
  {
    id: 'HD13',
    totalItems: 1,
    totalAmount: '157,750 ₫',
    customer: 'Nguyễn Thị Thùy Dương',
    date: '21/12/2023 13:48',
    type: 'Tại quầy',
    status: 'Chờ xác nhận'
  },
  {
    id: 'HD10',
    totalItems: 6,
    totalAmount: '2,127,500 ₫',
    customer: 'Khách lẻ',
    date: '21/12/2023 13:48',
    type: 'Tại quầy',
    status: 'Hoàn thành'
  },
  {
    id: 'HD9',
    totalItems: 6,
    totalAmount: '3,317,500 ₫',
    customer: 'Khách lẻ',
    date: '21/12/2023 13:39',
    type: 'Tại quầy',
    status: 'Hoàn thành'
  },
  {
    id: 'HD1703043383808',
    totalItems: 6,
    totalAmount: '660,000 ₫',
    customer: 'Nguyễn Văn Nhật',
    date: '20/12/2023 10:36',
    type: 'Trực tuyến',
    status: 'Chờ giao hàng'
  },
  {
    id: 'HD1703043048548',
    totalItems: 1,
    totalAmount: '34,000 ₫',
    customer: 'Nguyễn Thị Thùy Dương',
    date: '20/12/2023 10:30',
    type: 'Trực tuyến',
    status: 'Đã hủy'
  }
];

const statusColors = {
  'Chờ xác nhận': 'warning',
  'Hoàn thành': 'info',
  'Chờ giao hàng': 'secondary',
  'Đã hủy': 'success'
};

const typeColors = {
  'Tại quầy': 'success',
  'Trực tuyến': 'primary'
};

const statusTabs = ['Tất cả', 'Đã hủy', 'Chờ xác nhận', 'Chờ giao hàng', 'Đang vận chuyển', 'Đã giao hàng', 'Chờ thanh toán', 'Hoàn thành'];

function InvoiceManager() {
  const [selectedTab, setSelectedTab] = useState('Tất cả');
  const navigate = useNavigate();

  const filteredInvoices = selectedTab === 'Tất cả' ? invoices : invoices.filter((inv) => inv.status === selectedTab);

  return (
    <div style={{ backgroundColor: '#F7F4FD', minHeight: '100vh', paddingTop: '0.5rem', userSelect: 'none' }}>
      <div className="container mt-3">
        <Breadcrumb>
          <Breadcrumb.Item href="#">Trang Chủ</Breadcrumb.Item>
          <Breadcrumb.Item active>Quản Lý Hóa Đơn</Breadcrumb.Item>
        </Breadcrumb>

        <div className="bg-white rounded shadow-sm p-3 mb-3">
          <div className="d-flex flex-wrap gap-2 mb-3 align-items-center justify-content-between">
            <InputGroup style={{ maxWidth: '300px' }}>
              <Form.Control placeholder="Tìm kiếm hóa đơn" />
            </InputGroup>
            <div className="d-flex flex-wrap gap-2">
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                  ☰
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="#scan">
                    <FaQrcode className="me-2" />
                    Quét mã
                  </Dropdown.Item>
                  <Dropdown.Item href="#export">📥 Export Excel</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <Button variant="primary">
                <FaPlus className="me-1" /> Tạo hóa đơn
              </Button>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-3 align-items-center">
            <InputGroup style={{ maxWidth: '180px' }}>
              <InputGroup.Text>
                <FaCalendarAlt />
              </InputGroup.Text>
              <Form.Control type="date" />
            </InputGroup>

            <InputGroup style={{ maxWidth: '180px' }}>
              <InputGroup.Text>
                <FaCalendarAlt />
              </InputGroup.Text>
              <Form.Control type="date" />
            </InputGroup>

            <div className="d-flex gap-2">
              <Form.Check inline label="Tất cả" type="radio" name="loaiHD" defaultChecked />
              <Form.Check inline label="Trực tuyến" type="radio" name="loaiHD" />
              <Form.Check inline label="Tại quầy" type="radio" name="loaiHD" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded shadow-sm p-3 mb-4">
          <div className="mb-3 border-bottom pb-2 d-flex flex-wrap gap-3">
            {statusTabs.map((tab, idx) => (
              <span
                key={idx}
                onClick={() => setSelectedTab(tab)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedTab(tab)}
                tabIndex={0}
                role="button"
                className={selectedTab === tab ? 'text-primary fw-bold' : 'text-dark'}
                style={{ cursor: 'pointer' }}
              >
                {tab}
              </span>
            ))}
          </div>

          <Table hover responsive bordered>
            <thead>
              <tr className="table-light text-center">
                <th>#</th>
                <th>Mã</th>
                <th>Tổng SP</th>
                <th>Tổng số tiền</th>
                <th>Tên khách hàng</th>
                <th>Ngày tạo</th>
                <th>Loại hoá đơn</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center text-muted">
                    Không có hóa đơn nào
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice, idx) => (
                  <tr key={invoice.id}>
                    <td className="text-center">{idx + 1}</td>
                    <td>{invoice.id}</td>
                    <td className="text-center">{invoice.totalItems}</td>
                    <td>{invoice.totalAmount}</td>
                    <td>{invoice.customer}</td>
                    <td>{invoice.date}</td>
                    <td className="text-center">
                      <Badge bg={typeColors[invoice.type]}>{invoice.type}</Badge>
                    </td>
                    <td className="text-center">
                      <Badge bg={statusColors[invoice.status]}>{invoice.status}</Badge>
                    </td>
                    <td className="text-center">
                      <Dropdown align="end">
                        <Dropdown.Toggle variant="light" className="rounded-circle border-0">
                          ⋮
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => navigate(`/HoaDon/ChiTiet/${invoice.id}`)}>Chi tiết</Dropdown.Item>
                          <Dropdown.Item>Sửa</Dropdown.Item>
                          <Dropdown.Item>Xóa</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>{filteredInvoices.length > 0 ? `1-${filteredInvoices.length} của ${filteredInvoices.length}` : '0 hóa đơn'}</div>
            <Pagination>
              <Pagination.Prev />
              <Pagination.Next />
            </Pagination>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceManager;
