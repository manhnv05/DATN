import React from 'react';
import { Container, Row, Col, Table, Form, Button, InputGroup, Dropdown, Pagination, Breadcrumb } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HiOutlineFilter } from 'react-icons/hi';

function DiscountList() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 8;

  const discounts = [...Array(28)].map((_, i) => ({
    code: `PGG111${i + 1}`,
    name: 'GiamGia1',
    type: '10%',
    style: i % 2 === 0 ? 'Công Khai' : 'Cá Nhân',
    startDate: '29/05/2025',
    endDate: '30/05/2025',
    quantity: Math.floor(Math.random() * 100 + 1),
    status: 'Đang Diễn Ra'
  }));

  const totalItems = discounts.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = discounts.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div
      style={{
        backgroundColor: '#F7F4FD',
        minHeight: '100vh',
        paddingTop: '0.1rem',
        userSelect: 'none'
      }}
    >
      <Container className="mt-3">
        <Breadcrumb>
          <Breadcrumb.Item href="#">Trang Chủ</Breadcrumb.Item>
          <Breadcrumb.Item active>Phiếu Giảm Giá</Breadcrumb.Item>
        </Breadcrumb>

        {/* Thanh công cụ lọc và tìm kiếm */}
        <Row className="mt-4 mb-3">
          <Col md={4}>
            <InputGroup>
              <Form.Control placeholder="Tìm kiếm phiếu giảm giá" />
            </InputGroup>
          </Col>
        </Row>

        {/* Bảng danh sách phiếu giảm giá */}
        <h5 className="fw-bold mb-3">Phiếu Giảm Giá ({totalItems})</h5>
        <Row className="mb-3">
          <Col md={9}>
            <Row className="g-2">
              <Col md={2}>
                <Form.Control type="date" className="form-control" />
              </Col>
              <Col md={2}>
                <Form.Control type="date" className="form-control" />
              </Col>
              <Col md={2}>
                <Form.Select className="form-select">
                  <option>Kiểu</option>
                  <option>Công Khai</option>
                  <option>Cá Nhân</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Select className="form-select">
                  <option>Loại</option>
                  <option>10%</option>
                  <option>20%</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Select className="form-select">
                  <option>Trạng Thái</option>
                  <option>Đang Diễn Ra</option>
                  <option>Đã Kết Thúc</option>
                </Form.Select>
              </Col>
            </Row>
          </Col>

          <Col xs="auto" className="d-flex align-items-center gap-2 mt-2 mt-md-0">
            <Button variant="outline-secondary">
              <HiOutlineFilter className="me-1" />
            </Button>
            <Button variant="outline-secondary">☰</Button>
            <Button variant="primary">+ Thêm Mới</Button>
          </Col>
        </Row>

        <Table hover bordered responsive className="bg-white rounded-4 shadow-sm">
          <thead className="table-light">
            <tr>
              <th>STT</th>
              <th>Mã Phiếu Giảm Giá</th>
              <th>Tên Phiếu Giảm Giá</th>
              <th>Loại</th>
              <th>Kiểu</th>
              <th>Ngày Bắt Đầu</th>
              <th>Ngày Kết Thúc</th>
              <th>Số Lượng</th>
              <th>Trạng Thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={index}>
                <td>{startIndex + index + 1}</td>
                <td>{item.code}</td>
                <td>{item.name}</td>
                <td>{item.type}</td>
                <td>
                  <span className="badge bg-secondary">{item.style}</span>
                </td>
                <td>{item.startDate}</td>
                <td>{item.endDate}</td>
                <td>{item.quantity}</td>
                <td>
                  <span className="badge bg-success">{item.status}</span>
                </td>
                <td className="text-center">
                  <Dropdown align="end">
                    <Dropdown.Toggle variant="light" className="border-0">
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
            ))}
          </tbody>
        </Table>

        {/* Phân trang */}
        <div className="d-flex justify-content-between align-items-center">
          <span className="text-muted">{`${startIndex + 1}-${startIndex + currentItems.length} of ${totalItems}`}</span>
          <Pagination>
            <Pagination.Prev disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} />
            <Pagination.Next disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} />
          </Pagination>
        </div>
      </Container>
    </div>
  );
}

export default DiscountList;
