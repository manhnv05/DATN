import React, { useState } from 'react';
import { Breadcrumb, Container, Row, Col, Card, Dropdown, Pagination, Form, Button, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const employees = [
  {
    name: 'Evan Yates',
    email: 'evanyates@gmail.com',
    code: 'NV001',
    gender: 'Nam',
    dob: 'Apr 12, 1995',
    phone: '0123456789',
    role: 'Nhân Viên Bán Hàng',
    status: 'Đang Làm',
    avatar: 'https://randomuser.me/api/portraits/men/10.jpg'
  },
  {
    name: 'Lenora Fowler',
    email: 'cra@ilgc.gov',
    code: 'NV002',
    gender: 'Nữ',
    dob: 'Apr 28, 1998',
    phone: '0123456789',
    role: 'Nhân Viên Bán Hàng',
    status: 'Đang Làm',
    avatar: 'https://randomuser.me/api/portraits/women/10.jpg'
  },
  {
    name: 'Winnie McGuire',
    email: 'winnie3498@gmail.com',
    code: 'NV003',
    gender: 'Nữ',
    dob: 'Apr 12, 1995',
    phone: '0123456789',
    role: 'Nhân Viên Bán Hàng',
    status: 'Đang Làm',
    avatar: 'https://randomuser.me/api/portraits/women/11.jpg'
  },
  {
    name: 'James Williamson',
    email: 'williamsonjr@gmail.com',
    code: 'NV004',
    gender: 'Nam',
    dob: 'Sep 23, 1992',
    phone: '0123456789',
    role: 'Nhân Viên Bán Hàng',
    status: 'Đang Làm',
    avatar: 'https://randomuser.me/api/portraits/men/11.jpg'
  },
  {
    name: 'Emily Tyler',
    email: 'tyleremily24@gmail.com',
    code: 'NV005',
    gender: 'Nữ',
    dob: 'May 16, 1996',
    phone: '0123456789',
    role: 'Nhân Viên Bán Hàng',
    status: 'Đang Làm',
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg'
  }
];

function EmployeeList() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="bg-light min-vh-100 py-3">
      <Container>
        <Breadcrumb>
          <Breadcrumb.Item href="#">Trang Chủ</Breadcrumb.Item>
          <Breadcrumb.Item active>Nhân Viên</Breadcrumb.Item>
        </Breadcrumb>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Control placeholder="Tìm kiếm nhân viên" />
          </Col>
          <Col md="auto" className="ms-auto">
            <Button variant="primary">+ Thêm Nhân Viên</Button>
          </Col>
        </Row>

        <h4 className="mb-3">Nhân Viên ({employees.length})</h4>

        <Card className="shadow-sm">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <table className="table mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th></th>
                    <th>Họ tên & Email</th>
                    <th>Mã NV</th>
                    <th>Giới tính</th>
                    <th>Ngày sinh</th>
                    <th>SĐT</th>
                    <th>Chức vụ</th>
                    <th>Trạng thái</th>
                    <th className="text-end">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp, index) => (
                    <tr
                      key={index}
                      className={hoveredIndex === index ? 'bg-light' : ''}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <td>
                        <Image src={emp.avatar} roundedCircle width={48} height={48} alt="avatar" />
                      </td>
                      <td>
                        <strong>{emp.name}</strong>
                        <div className="text-muted">{emp.email}</div>
                      </td>
                      <td>{emp.code}</td>
                      <td>{emp.gender}</td>
                      <td>{emp.dob}</td>
                      <td>{emp.phone}</td>
                      <td>{emp.role}</td>
                      <td>
                        <span className="text-success fw-bold">{emp.status}</span>
                      </td>
                      <td className="text-end">
                        <Dropdown>
                          <Dropdown.Toggle as={Button} variant="light" size="sm" id={`dropdown-${index}`} className="text-muted border-0">
                            ⋮
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item>Sửa</Dropdown.Item>
                            <Dropdown.Item>Xóa</Dropdown.Item>
                            <Dropdown.Item>Chi tiết</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>

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

export default EmployeeList;
