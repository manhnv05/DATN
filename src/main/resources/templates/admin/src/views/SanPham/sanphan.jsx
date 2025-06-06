import React, { useState } from 'react';
import { Table, Button, Form, InputGroup, Pagination, Dropdown, Breadcrumb, Row, Col } from 'react-bootstrap';
import { FaQrcode, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const sampleData = [
  { name: 'Puma 2023', date: '20-12-2023', quantity: 6, status: 'Đang bán' },
  { name: 'Converse Venom', date: '20-12-2023', quantity: 8, status: 'Đang bán' },
  { name: 'Rebound Puma V6', date: '20-12-2023', quantity: 4, status: 'Đang bán' },
  { name: 'Nike Dunk 2022', date: '20-12-2023', quantity: 9, status: 'Đang bán' },
  { name: 'Balen Grey 2023', date: '20-12-2023', quantity: 9, status: 'Đang bán' }
];

const ProductTable = () => {
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [viewCount, setViewCount] = useState(5);
  const navigate = useNavigate();

  // Lọc dữ liệu theo search và trạng thái
  const filteredData = sampleData
    .filter((item) => (statusFilter === 'Tất cả' || item.status === statusFilter) && item.name.toLowerCase().includes(search.toLowerCase()))
    .slice(0, viewCount);

  return (
    <div style={{ background: '#F4F6FB', minHeight: '100vh', padding: 16, userSelect: 'none' }}>
      <Breadcrumb>
        <Breadcrumb.Item href="#">Trang Chủ</Breadcrumb.Item>
        <Breadcrumb.Item active>Sản Phẩm</Breadcrumb.Item>
      </Breadcrumb>

      <div className="bg-light p-3 rounded shadow-sm">
        <Row className="g-3 align-items-center mb-2">
          <Col xs={12} md={4} lg={3}>
            <InputGroup>
              <Form.Control
                placeholder="Tìm kiếm sản phẩm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Tìm kiếm sản phẩm"
              />
            </InputGroup>
          </Col>
          <Col xs={12} md={8} lg={6} className="d-flex flex-wrap align-items-center gap-2 justify-content-end mt-2 mt-md-0">
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                ☰
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#scan">
                  <FaQrcode className="me-2" /> Quét mã
                </Dropdown.Item>
                <Dropdown.Item href="#export">📥 Export Excel</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Button variant="primary" onClick={() => navigate('/SanPham/ThemMoi')}>
              <FaPlus className="me-1" /> Thêm sản phẩm
            </Button>
          </Col>
        </Row>

        {/* Trạng thái filter: hàng ngang bên dưới tìm kiếm */}
        <Row className="mb-3">
          <Col xs={12}>
            <div className="d-flex align-items-center gap-3 flex-wrap mt-2">
              <strong>Trạng thái:</strong>
              {['Tất cả', 'Đang bán', 'Ngừng bán'].map((status) => (
                <Form.Check
                  key={status}
                  type="radio"
                  label={status}
                  name="status"
                  checked={statusFilter === status}
                  onChange={() => setStatusFilter(status)}
                  className="me-2"
                  style={{ minWidth: 110 }}
                  inline
                />
              ))}
            </div>
          </Col>
        </Row>

        <div className="table-responsive">
          <Table striped bordered hover className="bg-white align-middle mb-0">
            <thead>
              <tr>
                <th style={{ minWidth: 60 }}>STT</th>
                <th style={{ minWidth: 180 }}>Tên sản phẩm</th>
                <th style={{ minWidth: 120 }}>Ngày thêm</th>
                <th style={{ minWidth: 100 }}>Số lượng</th>
                <th style={{ minWidth: 120 }}>Trạng thái</th>
                <th style={{ minWidth: 80 }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.date}</td>
                    <td>{item.quantity}</td>
                    <td>
                      <span className="badge bg-success-subtle text-success border border-success px-2 py-1">{item.status}</span>
                    </td>
                    <td className="text-center">
                      <Dropdown align="end">
                        <Dropdown.Toggle variant="light" className="rounded-circle border-0">
                          ⋮
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item>Chi tiết</Dropdown.Item>
                          <Dropdown.Item>Sửa</Dropdown.Item>
                          <Dropdown.Item>Xóa</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center text-secondary py-4">
                    Không có sản phẩm phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        <Row className="align-items-center mt-3">
          <Col xs={12} md="auto" className="mb-2 mb-md-0">
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" size="sm">
                Xem {viewCount} sản phẩm
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {[5, 10, 20].map((n) => (
                  <Dropdown.Item key={n} onClick={() => setViewCount(n)}>
                    Xem {n} sản phẩm
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          <Col>
            <Pagination className="mb-0 justify-content-end">
              <Pagination.Prev />
              <Pagination.Item active>1</Pagination.Item>
              <Pagination.Item>2</Pagination.Item>
              <Pagination.Next />
            </Pagination>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProductTable;
