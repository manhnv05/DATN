import React, { useState } from 'react';
import { Form, Row, Col, Button, Table, Modal, Breadcrumb } from 'react-bootstrap';

// Mock data for demo
const COLOR_OPTIONS = ['Đỏ', 'Xanh', 'Vàng', 'Trắng', 'Đen', 'Tím', 'Xanh dương'];
const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', 'XXL', '40', '41'];
const COLLAR_OPTIONS = ['Cổ tròn', 'Cổ bẻ', 'Cổ V'];
const SLEEVE_OPTIONS = ['Ngắn', 'Dài'];

// Ảnh mẫu cho modal
const MOCK_COLOR_IMAGES = {
  'Xanh dương': [
    'https://static.nike.com/a/images/t_prod_ss/w_960,c_limit,f_auto/1d7e1b25-3e5a-478c-827c-5a169d94d3e5/air-jordan-1-low-og-black-dark-powder-blue-ct8532-104-release-date.jpg',
    'https://static.nike.com/a/images/t_prod_ss/w_960,c_limit,f_auto/5f3a7e3b-1f38-4d3b-9a60-5f2c9f9e774d/dunk-high-blue-white-release-date.jpg',
    'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/0c43b657-6d9b-4fbb-abe1-4ca2b1df29ae/air-zoom-alphafly-next-nature-road-racing-shoes-5JwR6k.png',
    'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/5e6c7a1d-ae9d-4e78-859f-4b2d453d6b7f/air-max-95-og-mens-shoes-4bCdLk.png',
    'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/5e6c7a1d-ae9d-4e78-859f-4b2d453d6b7f/air-max-95-og-mens-shoes-4bCdLk.png'
  ]
};

const mockProductVariants = [
  {
    color: 'Xanh dương',
    products: [
      { name: 'Kkkk', size: '40', weight: 500, qty: 100, price: 100000, unit: 'g', image: '' },
      { name: 'Kkkk', size: '41', weight: 500, qty: 100, price: 100000, unit: 'g', image: '' }
    ]
  },
  {
    color: 'Tím',
    products: [
      { name: 'Kkkk', size: '40', weight: 500, qty: 100, price: 100000, unit: 'g', image: '' },
      { name: 'Kkkk', size: '41', weight: 500, qty: 100, price: 100000, unit: 'g', image: '' }
    ]
  }
];

const ProductForm = () => {
  // State cho các thuộc tính động
  const [colors, setColors] = useState(['']);
  const [sizes, setSizes] = useState(['']);
  const [collars, setCollars] = useState(['']);
  const [sleeves, setSleeves] = useState(['']);

  // Modal state
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalColor, setModalColor] = useState('');
  const [selectedImages, setSelectedImages] = useState([]); // checked images in modal

  // Hiển thị bảng sản phẩm khi đã chọn đủ các thuộc tính
  const isAllFieldsSelected =
    colors.length > 0 &&
    colors.every((c) => !!c) &&
    sizes.length > 0 &&
    sizes.every((s) => !!s) &&
    collars.length > 0 &&
    collars.every((c) => !!c) &&
    sleeves.length > 0 &&
    sleeves.every((s) => !!s);

  // Xử lý thay đổi giá trị select động
  const handleChange = (setter, arr, idx, value) => {
    const newArr = [...arr];
    newArr[idx] = value;
    setter(newArr);
  };

  // Thêm select mới
  const handleAddSelect = (setter, arr) => {
    setter([...arr, '']);
  };

  // Xóa select
  const handleRemoveSelect = (setter, arr, idx) => {
    const newArr = arr.filter((_, i) => i !== idx);
    setter(newArr.length ? newArr : ['']);
  };

  // Modal logic
  const openImageModal = (color) => {
    setModalColor(color);
    setShowImageModal(true);
    setSelectedImages([]); // reset checked state
  };
  const closeImageModal = () => setShowImageModal(false);

  // Render bảng sản phẩm từng màu (bổ sung theo hình)
  const renderProductColorTable = (variant, idx) => (
    <div key={idx} className="bg-white shadow rounded-3 border mb-4 p-3" style={{ userSelect: 'none' }}>
      <div className="fw-bold mb-2" style={{ color: '#1976d2', fontSize: 16 }}>
        Danh sách sản phẩm màu {variant.color}
      </div>
      <Table bordered hover responsive className="mb-0">
        <thead>
          <tr>
            <th style={{ width: 40 }}>
              <Form.Check type="checkbox" />
            </th>
            <th>Sản phẩm</th>
            <th>Kích cỡ</th>
            <th>Cân nặng</th>
            <th>Số lượng</th>
            <th>Giá</th>
            <th>Ảnh</th>
            <th style={{ width: 40 }}></th>
          </tr>
        </thead>
        <tbody>
          {variant.products.map((p, i) => (
            <tr key={i}>
              <td>
                <Form.Check type="checkbox" />
              </td>
              <td>
                <Form.Control value={p.name} size="sm" />
              </td>
              <td>
                <Form.Control value={p.size} size="sm" />
              </td>
              <td className="d-flex align-items-center">
                <Form.Control type="number" value={p.weight} size="sm" style={{ width: 80 }} />
                <span className="mx-1">{p.unit}</span>
              </td>
              <td>
                <Form.Control type="number" value={p.qty} size="sm" />
              </td>
              <td>
                <Form.Control type="number" value={p.price} size="sm" />
              </td>
              <td>
                <div
                  role="button"
                  tabIndex={0}
                  style={{
                    border: '1px dashed #bbb',
                    borderRadius: 4,
                    minHeight: 60,
                    minWidth: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={() => openImageModal(variant.color)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      openImageModal(variant.color);
                    }
                  }}
                  title="Chọn ảnh"
                >
                  <span style={{ color: '#888', fontSize: 12 }}>
                    <i className="bi bi-image" style={{ fontSize: 20 }} /> Ảnh
                  </span>
                </div>
              </td>
              <td>
                <Button variant="link" size="sm" style={{ color: '#e74c3c' }}>
                  <i className="bi bi-trash" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="text-end mt-2">
        <Button size="sm" variant="outline-warning">
          Khôi phục
        </Button>
      </div>
    </div>
  );

  // Render modal chọn ảnh theo màu
  const renderImageModal = () => (
    <Modal show={showImageModal} onHide={closeImageModal} size="lg" centered style={{ userSelect: 'none' }}>
      <Modal.Body>
        <div className="fw-bold mb-2">Danh sách ảnh đã chọn</div>
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ minHeight: 100, border: '1px dashed #d5d5d5', borderRadius: 8, width: '100%' }}
        >
          <div className="text-center text-secondary">
            <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="no-img" style={{ width: 48, opacity: 0.5 }} />
            <div style={{ fontSize: 14, opacity: 0.7 }}>No Data Found</div>
          </div>
        </div>
        <div className="fw-bold mt-4 mb-2">Danh sách ảnh màu {modalColor}</div>
        <div className="d-flex flex-wrap gap-3">
          {(MOCK_COLOR_IMAGES[modalColor] || []).map((img, idx) => (
            <div
              key={img}
              style={{
                border: '2px dashed orange',
                borderRadius: 8,
                padding: 4,
                position: 'relative',
                width: 120,
                height: 110,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Form.Check
                type="checkbox"
                checked={selectedImages.includes(idx)}
                onChange={() => {
                  setSelectedImages((sel) => (sel.includes(idx) ? sel.filter((v) => v !== idx) : [...sel, idx]));
                }}
                style={{ position: 'absolute', left: 2, top: 2, zIndex: 2 }}
              />
              <img
                src={img}
                alt="Ảnh màu"
                style={{
                  width: 100,
                  height: 80,
                  objectFit: 'cover',
                  borderRadius: 4
                }}
              />
            </div>
          ))}
          <Button
            variant="outline-warning"
            size="sm"
            className="d-flex flex-column align-items-center justify-content-center"
            style={{
              border: '2px dashed orange',
              borderRadius: 8,
              width: 120,
              height: 110,
              fontSize: 14
            }}
          >
            <i className="bi bi-plus-circle" style={{ fontSize: 28 }} />
            Thêm ảnh
          </Button>
        </div>
        <div className="text-center mt-4">
          <Button variant="danger" onClick={closeImageModal}>
            Đóng
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );

  return (
    <div className="container mt-4" style={{ userSelect: 'none' }}>
      {/* ========== DIV 1: Thông tin cơ bản ========== */}
      <Breadcrumb>
        <Breadcrumb.Item href="#">Trang Chủ</Breadcrumb.Item>
        <Breadcrumb.Item active>Sản Phẩm</Breadcrumb.Item>
        <Breadcrumb.Item active>Thêm Sản Phẩm</Breadcrumb.Item>
      </Breadcrumb>
      <div className="p-4 bg-white shadow rounded-3 border mb-4">
        <Form.Group className="mb-3">
          <Form.Label>
            <span className="text-danger">*</span> Tên sản phẩm
          </Form.Label>
          <Form.Control type="text" placeholder="Nhập tên sản phẩm" />
        </Form.Group>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                <span className="text-danger">*</span> Danh mục
              </Form.Label>
              <Form.Select>
                <option>Chọn danh mục</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                <span className="text-danger">*</span> Thương hiệu
              </Form.Label>
              <Form.Select>
                <option>Chọn thương hiệu</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                <span className="text-danger">*</span> Xuất xứ
              </Form.Label>
              <Form.Select>
                <option>Chọn quốc gia</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                <span className="text-danger">*</span> Chất liệu
              </Form.Label>
              <Form.Select>
                <option>Chọn chất liệu</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-3">
          <Form.Label>Mô tả sản phẩm</Form.Label>
          <Form.Control as="textarea" rows={3} placeholder="Nhập mô tả sản phẩm" />
        </Form.Group>
      </div>

      {/* ========== DIV 3: Các thuộc tính sản phẩm ========== */}
      <div className="p-4 bg-white shadow rounded-3 border" style={{ userSelect: 'none' }}>
        <h5 className="mb-3">Màu sắc & Kích cỡ</h5>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>
                <span className="text-danger">*</span> Màu sắc:
              </Form.Label>
              {colors.map((color, idx) => (
                <div className="d-flex align-items-center gap-2 mb-2" key={idx}>
                  <Form.Select value={color} onChange={(e) => handleChange(setColors, colors, idx, e.target.value)}>
                    <option value="">Chọn màu sắc</option>
                    {COLOR_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </Form.Select>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveSelect(setColors, colors, idx)}
                    disabled={colors.length === 1}
                  >
                    -
                  </Button>
                  {idx === colors.length - 1 && (
                    <Button variant="warning" size="sm" onClick={() => handleAddSelect(setColors, colors)}>
                      +
                    </Button>
                  )}
                </div>
              ))}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>
                <span className="text-danger">*</span> Kích cỡ:
              </Form.Label>
              {sizes.map((size, idx) => (
                <div className="d-flex align-items-center gap-2 mb-2" key={idx}>
                  <Form.Select value={size} onChange={(e) => handleChange(setSizes, sizes, idx, e.target.value)}>
                    <option value="">Chọn kích cỡ</option>
                    {SIZE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </Form.Select>
                  <Button variant="danger" size="sm" onClick={() => handleRemoveSelect(setSizes, sizes, idx)} disabled={sizes.length === 1}>
                    -
                  </Button>
                  {idx === sizes.length - 1 && (
                    <Button variant="warning" size="sm" onClick={() => handleAddSelect(setSizes, sizes)}>
                      +
                    </Button>
                  )}
                </div>
              ))}
            </Form.Group>
          </Col>
        </Row>
        <h5 className="mt-4 mb-3">Cổ áo & Tay áo</h5>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>
                <span className="text-danger">*</span> Cổ áo:
              </Form.Label>
              {collars.map((collar, idx) => (
                <div className="d-flex align-items-center gap-2 mb-2" key={idx}>
                  <Form.Select value={collar} onChange={(e) => handleChange(setCollars, collars, idx, e.target.value)}>
                    <option value="">Chọn kiểu cổ áo</option>
                    {COLLAR_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              ))}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>
                <span className="text-danger">*</span> Tay áo:
              </Form.Label>
              {sleeves.map((sleeve, idx) => (
                <div className="d-flex align-items-center gap-2 mb-2" key={idx}>
                  <Form.Select value={sleeve} onChange={(e) => handleChange(setSleeves, sleeves, idx, e.target.value)}>
                    <option value="">Chọn kiểu tay áo</option>
                    {SLEEVE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              ))}
            </Form.Group>
          </Col>
        </Row>
        {!isAllFieldsSelected && (
          <div className="text-end mt-3">
            <Button variant="primary" disabled>
              Vui lòng chọn đầy đủ thuộc tính để xem danh sách sản phẩm
            </Button>
          </div>
        )}
      </div>
      {isAllFieldsSelected && (
        <div className="my-4">
          <div className="text-end mb-2">
            <Button variant="success" size="sm">
              Thêm sản phẩm mới
            </Button>
          </div>
          {mockProductVariants.map((variant, idx) => renderProductColorTable(variant, idx))}
        </div>
      )}
      {renderImageModal()}
    </div>
  );
};

export default ProductForm;
