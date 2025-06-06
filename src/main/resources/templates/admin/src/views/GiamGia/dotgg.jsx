import React, { useState } from 'react';
import { Container, Row, Col, Table, Button, InputGroup, Form, Dropdown, Pagination, Badge, Breadcrumb, Card } from 'react-bootstrap';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { HiOutlineFilter } from 'react-icons/hi';
import 'bootstrap/dist/css/bootstrap.min.css';

const discountData = Array.from({ length: 28 }, (_, i) => ({
  id: i + 1,
  name: `GiamGia${i + 1}`,
  type: i % 2 === 0 ? '10%' : '20%',
  startDate: '29/05/2025',
  endDate: '30/05/2025',
  status: i % 3 === 0 ? 'Đã Kết Thúc' : 'Đang Diễn Ra'
}));

function DiscountPage() {
  const [search] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  const filteredData = discountData.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filteredData.length / perPage);
  const currentItems = filteredData.slice((currentPage - 1) * perPage, currentPage * perPage);

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
          <Breadcrumb.Item active>Đợt Giảm Giá</Breadcrumb.Item>
        </Breadcrumb>

        <div className="bg-white p-4 shadow-sm rounded">
          {/* Tìm kiếm và nút điều khiển */}
          <Row className="mt-4 mb-3">
            <Col md={4}>
              <InputGroup>
                <Form.Control placeholder="Tìm kiếm đợt giảm giá" />
              </InputGroup>
            </Col>
          </Row>

          <h5 className="fw-bold mb-3">Đợt Giảm Giá ({filteredData.length})</h5>
          <Row className="mb-3">
            <Col md={12} className="d-flex justify-content-end gap-2 mt-2 mt-md-0">
              <Button variant="outline-secondary" onClick={() => setShowFilters(!showFilters)}>
                <HiOutlineFilter className="me-1" />
                Bộ lọc
              </Button>
              <Button variant="outline-secondary">☰</Button>
              <Button variant="primary">+ Thêm Mới</Button>
            </Col>
          </Row>

          {/* Bộ lọc nâng cao */}
          {showFilters && (
            <Row className="mb-3 g-2">
              <Col md={2}>
                <Form.Control type="date" />
              </Col>
              <Col md={2}>
                <Form.Control type="date" />
              </Col>
              <Col md={2}>
                <Form.Select>
                  <option>Kiểu</option>
                  <option>Công Khai</option>
                  <option>Cá Nhân</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Select>
                  <option>Loại</option>
                  <option>10%</option>
                  <option>20%</option>
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Select>
                  <option>Trạng Thái</option>
                  <option>Đang Diễn Ra</option>
                  <option>Đã Kết Thúc</option>
                </Form.Select>
              </Col>
            </Row>
          )}

          <Card className="shadow-sm border-0 rounded-4">
            <Table hover responsive className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>STT</th>
                  <th>Tên Đợt Giảm Giá</th>
                  <th>Giá Trị</th>
                  <th>Ngày Bắt Đầu</th>
                  <th>Ngày Kết Thúc</th>
                  <th>Trạng Thái</th>
                  <th className="text-end">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{(currentPage - 1) * perPage + idx + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.type}</td>
                    <td>{item.startDate}</td>
                    <td>{item.endDate}</td>
                    <td>
                      <Badge bg={item.status === 'Đang Diễn Ra' ? 'success' : 'secondary'} pill>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="text-end">
                      <Dropdown align="end">
                        <Dropdown.Toggle as="span" style={{ cursor: 'pointer' }}>
                          <BsThreeDotsVertical />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item>Xem chi tiết</Dropdown.Item>
                          <Dropdown.Item>Sửa</Dropdown.Item>
                          <Dropdown.Item>Xóa</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>

          {/* Phân trang */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="text-muted">
              {currentItems.length > 0 && `${(currentPage - 1) * perPage + 1}-${(currentPage - 1) * perPage + currentItems.length}`}
              trong {filteredData.length}
            </div>
            <Pagination>
              {[...Array(totalPages)].map((_, i) => (
                <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
                  {i + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default DiscountPage;
