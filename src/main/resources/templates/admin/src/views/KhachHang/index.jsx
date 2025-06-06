import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  InputGroup,
  FormControl,
  Card,
  Dropdown,
  Breadcrumb,
  Pagination,
  Table,
  Image
} from 'react-bootstrap';
import { HiOutlineFilter } from 'react-icons/hi';
import 'bootstrap/dist/css/bootstrap.min.css';

const initialCustomers = [
  {
    name: 'Evan Yates',
    email: 'evanyates@gmail.com',
    gender: 'Male',
    phone: '0123456789',
    age: 25,
    avatar: 'https://i.pravatar.cc/100?img=1'
  },
  {
    name: 'Lenora Fowler',
    email: 'erav@cc.gov',
    gender: 'Female',
    phone: '0123456789',
    age: 23,
    avatar: 'https://i.pravatar.cc/100?img=2'
  },
  {
    name: 'Winnie McGuire',
    email: 'winnie34@gmail.com',
    gender: 'Female',
    phone: '0123456789',
    age: 25,
    avatar: 'https://i.pravatar.cc/100?img=3'
  },
  {
    name: 'James Williamson',
    email: 'williamsonjl@gmail.com',
    gender: 'Male',
    phone: '0123456789',
    age: 28,
    avatar: 'https://i.pravatar.cc/100?img=4'
  },
  {
    name: 'Emily Tyler',
    email: 'etylerm124@gmail.com',
    gender: 'Female',
    phone: '0123456789',
    age: 24,
    avatar: 'https://i.pravatar.cc/100?img=5'
  },
  {
    name: 'Thomas Schneider',
    email: 'thomas.s@gmail.com',
    gender: 'Male',
    phone: '0123456789',
    age: 23,
    avatar: 'https://i.pravatar.cc/100?img=6'
  },
  {
    name: 'Sallie Long',
    email: 'salliellong@gmail.com',
    gender: 'Female',
    phone: '0123456789',
    age: 25,
    avatar: 'https://i.pravatar.cc/100?img=7'
  },
  {
    name: 'Kathryn Guerrero',
    email: 'kathryn1992@gmail.com',
    gender: 'Female',
    phone: '0123456789',
    age: 28,
    avatar: 'https://i.pravatar.cc/100?img=8'
  }
];

function CustomerList() {
  const [customers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  const filteredCustomers = customers.filter(
    (c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredCustomers.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // reset trang khi tìm kiếm
  };

  return (
    <div style={{ backgroundColor: '#F4F6FB', minHeight: '100vh', padding: '20px' }}>
      <Container>
        {/* Breadcrumb */}
        <Breadcrumb>
          <Breadcrumb.Item href="#">Trang Chủ</Breadcrumb.Item>
          <Breadcrumb.Item active>Khách Hàng</Breadcrumb.Item>
        </Breadcrumb>

        {/* Tiêu đề */}
        <h4 className="fw-bold mb-3">Khách Hàng ({totalItems})</h4>

        {/* Tìm kiếm và hành động */}
        <Row className="mb-3 align-items-center justify-content-between">
          <Col xs={12} md={6}>
            <InputGroup>
              <FormControl placeholder="Tìm Kiếm Khách hàng" value={searchTerm} onChange={handleSearchChange} />
            </InputGroup>
          </Col>
          <Col xs="auto" className="d-flex align-items-center gap-2 mt-2 mt-md-0">
            <Button variant="outline-secondary">☰</Button>
            <Button variant="outline-secondary">
              <HiOutlineFilter className="me-1" />
            </Button>
            <Button variant="primary">+ Thêm khách hàng</Button>
          </Col>
        </Row>

        {/* Bảng khách hàng */}
        <Card className="p-3 border-0 shadow-sm rounded-4 bg-white">
          {currentCustomers.length > 0 ? (
            <Table responsive hover className="align-middle mb-0">
              <thead>
                <tr>
                  <th className="text-center">#</th>
                  <th>Khách Hàng</th>
                  <th>Giới Tính</th>
                  <th>SĐT</th>
                  <th>Tuổi</th>
                  <th className="text-end">Tùy Chọn</th>
                </tr>
              </thead>
              <tbody>
                {currentCustomers.map((c, index) => (
                  <tr key={index}>
                    <td className="text-center">
                      <Image src={c.avatar} alt="avatar" roundedCircle width={40} height={40} />
                    </td>
                    <td>
                      <div className="fw-bold">{c.name}</div>
                      <div className="text-muted small">{c.email}</div>
                    </td>
                    <td>{c.gender}</td>
                    <td>{c.phone}</td>
                    <td>{c.age}</td>
                    <td className="text-end">
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
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-4 text-muted">Không tìm thấy khách hàng nào.</div>
          )}
        </Card>

        {/* Phân trang */}
        <div className="d-flex justify-content-end mt-3">
          <Pagination>
            <Pagination.First />
            <Pagination.Prev />
            <Pagination.Item>{1}</Pagination.Item>
            <Pagination.Ellipsis />
            <Pagination.Item>{10}</Pagination.Item>
            <Pagination.Item>{11}</Pagination.Item>
            <Pagination.Item active>{12}</Pagination.Item>
            <Pagination.Item>{13}</Pagination.Item>
            <Pagination.Item disabled>{14}</Pagination.Item>
            <Pagination.Ellipsis />
            <Pagination.Item>{20}</Pagination.Item>
            <Pagination.Next />
            <Pagination.Last />
          </Pagination>
        </div>
      </Container>
    </div>
  );
}

export default CustomerList;
