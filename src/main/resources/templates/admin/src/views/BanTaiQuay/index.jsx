import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Tabs, Tab, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Breadcrumb from 'react-bootstrap/Breadcrumb';

function POSPage() {
  const [orders, setOrders] = useState([{ id: 'HD1', title: 'Đơn hàng HD1', quantities: [2, 2] }]);
  const [activeOrderId, setActiveOrderId] = useState('HD1');
  const [isDelivery, setIsDelivery] = useState(true);
  const [discountVisible, setDiscountVisible] = useState(false);

  const itemPrice = 100000;
  const discountAmount = 1000;

  const handleCreateNewOrder = () => {
    const newId = `HD${orders.length + 1}`;
    const newOrder = {
      id: newId,
      title: `Đơn hàng ${newId}`,
      quantities: []
    };
    setOrders([...orders, newOrder]);
    setActiveOrderId(newId);
  };

  const handleQuantityChange = (orderId, index, delta) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              quantities: order.quantities.map((q, i) => (i === index ? Math.max(1, q + delta) : q))
            }
          : order
      )
    );
  };

  const handleDeleteProduct = (orderId, index) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          const newQuantities = [...order.quantities];
          newQuantities.splice(index, 1);
          return { ...order, quantities: newQuantities };
        }
        return order;
      })
    );
  };

  const getOrderById = (id) => orders.find((order) => order.id === id);
  const currentOrder = getOrderById(activeOrderId) || orders[0];
  const quantities = currentOrder?.quantities || [];

  const itemTotal = quantities.reduce((sum, q) => sum + q * itemPrice, 0);
  const shippingFee = isDelivery ? 20000 : 0;
  const total = itemTotal + shippingFee - discountAmount;

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '1.5rem' }}>
      <Container fluid>
        <Row className="align-items-center mb-4">
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item href="#">Trang Chủ</Breadcrumb.Item>
              <Breadcrumb.Item active>Bán Hàng tại Quầy</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Col className="text-end">
            <Button variant="outline-primary" className="me-2">
              <i className="bi bi-qr-code-scan me-1" /> Quét mã
            </Button>
            <Button variant="outline-primary" className="me-2">
              <i className="bi bi-cart me-1" /> Giỏ hàng
            </Button>
            <Button variant="primary" onClick={handleCreateNewOrder}>
              <i className="bi bi-plus-circle me-1" /> Tạo đơn hàng
            </Button>
          </Col>
        </Row>

        <Tabs activeKey={activeOrderId} onSelect={(k) => setActiveOrderId(k)} className="mb-3">
          {orders.map((order) => (
            <Tab
              eventKey={order.id}
              key={order.id}
              title={
                <div className="d-flex align-items-center" style={{ gap: '6px' }}>
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveOrderId(order.id);
                    }}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveOrderId(order.id);
                      }
                    }}
                  >
                    {order.title}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOrders((prev) => prev.filter((o) => o.id !== order.id));
                      if (activeOrderId === order.id) {
                        const remaining = orders.filter((o) => o.id !== order.id);
                        if (remaining.length > 0) setActiveOrderId(remaining[0].id);
                        else setActiveOrderId(null);
                      }
                    }}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: '#888',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      lineHeight: '1',
                      padding: 0,
                      margin: 0,
                      userSelect: 'none'
                    }}
                    aria-label="Đóng tab"
                  >
                    ×
                  </button>
                </div>
              }
            >
              <Card className="p-3 shadow-sm rounded-4 mb-4">
                {order.quantities.length === 0 ? (
                  <div className="text-center text-muted py-4 fs-5">Giỏ hàng trống</div>
                ) : (
                  <Table responsive hover bordered className="align-middle text-center">
                    <thead className="table-light">
                      <tr>
                        <th>#</th>
                        <th>Sản Phẩm</th>
                        <th>Số Lượng</th>
                        <th>Đơn Giá</th>
                        <th>Thành Tiền</th>
                        <th>Hành Động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.quantities.map((qty, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td className="text-start d-flex align-items-center">
                            <img src="https://via.placeholder.com/40" alt="SP" className="me-2 rounded" />
                            SWE VISION TEE - CREAM
                          </td>
                          <td>
                            <div className="d-flex justify-content-center align-items-center">
                              <Button size="sm" variant="outline-secondary" onClick={() => handleQuantityChange(order.id, idx, -1)}>
                                -
                              </Button>
                              <span className="mx-2 fw-semibold">{qty}</span>
                              <Button size="sm" variant="outline-secondary" onClick={() => handleQuantityChange(order.id, idx, 1)}>
                                +
                              </Button>
                            </div>
                          </td>
                          <td>{itemPrice.toLocaleString('vi-VN')} VND</td>
                          <td>{(itemPrice * qty).toLocaleString('vi-VN')} VND</td>
                          <td>
                            <Dropdown align="end">
                              <Dropdown.Toggle variant="light" size="sm" className="p-0">
                                <i className="bi bi-three-dots-vertical" />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleDeleteProduct(order.id, idx)}>
                                  <i className="bi bi-trash me-2" /> Xóa khỏi giỏ hàng
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => alert('Xem chi tiết')}>
                                  <i className="bi bi-info-circle me-2" /> Chi tiết
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card>
            </Tab>
          ))}
        </Tabs>

        <Row>
          <Col md={8}>
            <Card className="p-4 shadow-sm rounded-4 mb-4">
              <h5 className="fw-bold text-primary mb-3">Thông Tin Thanh Toán</h5>
              <Row className="mb-3">
                <Col md={8}>
                  <Form.Group>
                    <Form.Label>Tên Khách Hàng</Form.Label>
                    <Form.Control placeholder="Nguyễn Văn Mạnh" />
                  </Form.Group>
                </Col>
                <Col md={4} className="d-flex align-items-end">
                  <Button variant="outline-primary" className="w-100">
                    <i className="bi bi-person-circle me-1" /> Chọn khách hàng
                  </Button>
                </Col>
              </Row>
              {isDelivery && (
                <>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Tên người nhận</Form.Label>
                        <Form.Control defaultValue="Nguyễn Văn Mạnh" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Số điện thoại</Form.Label>
                        <Form.Control defaultValue="0909091211" />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col md={4}>
                      <Form.Select defaultValue="Hà Nội">
                        <option>Hà Nội</option>
                        <option>Hồ Chí Minh</option>
                      </Form.Select>
                    </Col>
                    <Col md={4}>
                      <Form.Select defaultValue="Cầu Giấy">
                        <option>Cầu Giấy</option>
                        <option>Ba Đình</option>
                      </Form.Select>
                    </Col>
                    <Col md={4}>
                      <Form.Select defaultValue="Mai Dịch">
                        <option>Mai Dịch</option>
                        <option>Dịch Vọng</option>
                      </Form.Select>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Control placeholder="Số nhà 1 ngõ 245" className="mb-3" />
                    </Col>
                    <Col md={6}>
                      <Form.Control placeholder="Ghi chú" className="mb-3" />
                    </Col>
                  </Row>
                </>
              )}
            </Card>
          </Col>

          <Col md={4}>
            <Card className="p-4 shadow-sm rounded-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="fw-semibold text-dark">Tùy chọn</span>
                <Form.Check type="switch" label="Giao Hàng" checked={isDelivery} onChange={(e) => setIsDelivery(e.target.checked)} />
              </div>

              {!discountVisible ? (
                <Button variant="outline-success" className="w-100 mb-3" onClick={() => setDiscountVisible(true)}>
                  <i className="bi bi-tag me-1" /> Áp dụng giảm giá
                </Button>
              ) : (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Mã phiếu giảm giá</Form.Label>
                    <Form.Control placeholder="PGG001" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Phần trăm giảm</Form.Label>
                    <Form.Control placeholder="10%" />
                  </Form.Group>
                  <Button variant="outline-danger" className="w-100 mb-3" onClick={() => setDiscountVisible(false)}>
                    <i className="bi bi-x-circle me-1" /> Không áp dụng
                  </Button>
                </>
              )}

              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Tiền Hàng:</span>
                <strong>{itemTotal.toLocaleString('vi-VN')} VND</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Phí Vận Chuyển:</span>
                <strong>{shippingFee.toLocaleString('vi-VN')} VND</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Giảm Giá:</span>
                <strong className="text-success">-{discountAmount.toLocaleString('vi-VN')} VND</strong>
              </div>
              <div className="d-flex justify-content-between mb-2 fs-5">
                <span className="fw-bold">Tổng cộng:</span>
                <strong className="text-primary">{total.toLocaleString('vi-VN')} VND</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Khách thanh toán:</span>
                <strong>0 VND</strong>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Tiền thiếu:</span>
                <strong className="text-danger">{total.toLocaleString('vi-VN')} VND</strong>
              </div>
              <Button variant="success" className="w-100">
                <i className="bi bi-check2-circle me-1" /> Xác Nhận Đặt Hàng
              </Button>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default POSPage;
