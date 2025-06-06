import React, { useState } from 'react';
import styled from 'styled-components';
import { Table, Button, Form, InputGroup, Dropdown, Breadcrumb, Pagination, Badge, Modal } from 'react-bootstrap';
import { FaPlus, FaQrcode } from 'react-icons/fa';

const sampleImages = [
  {
    ma_anh: 'IMG001',
    duong_dan_anh: '/images/ao1.png',
    anh_mac_dinh: true,
    mo_ta: 'Ảnh chính của áo đỏ',
    trang_thai: 'Hiển thị'
  },
  {
    ma_anh: 'IMG002',
    duong_dan_anh: '/images/ao1_2.png',
    anh_mac_dinh: false,
    mo_ta: 'Ảnh mặt sau',
    trang_thai: 'Ẩn'
  }
];

const ImageTable = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [previewImg, setPreviewImg] = useState('');

  const [formData, setFormData] = useState({
    ma_anh: '',
    duong_dan_anh: null,
    anh_mac_dinh: false,
    mo_ta: '',
    trang_thai: 'Hiển thị'
  });

  const filteredImages = sampleImages.filter((img) => {
    const matchSearch = img.mo_ta.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'Tất cả' || img.trang_thai === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleShowAddModal = () => {
    setEditingImage(null);
    setFormData({
      ma_anh: '',
      duong_dan_anh: null,
      anh_mac_dinh: false,
      mo_ta: '',
      trang_thai: 'Hiển thị'
    });
    setPreviewImg('');
    setShowModal(true);
  };

  const handleShowEditModal = (img) => {
    setEditingImage(img);
    setFormData({
      ma_anh: img.ma_anh,
      duong_dan_anh: null,
      anh_mac_dinh: img.anh_mac_dinh,
      mo_ta: img.mo_ta,
      trang_thai: img.trang_thai
    });
    setPreviewImg(img.duong_dan_anh);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (file) {
        setFormData((prev) => ({
          ...prev,
          duong_dan_anh: file
        }));
        setPreviewImg(URL.createObjectURL(file));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSave = () => {
    // Thêm/sửa hình ảnh: nếu cần validate có thể kiểm tra mã ảnh, mô tả...
    alert(editingImage ? 'Cập nhật hình ảnh (demo)' : 'Thêm hình ảnh (demo)');
    setShowModal(false);
  };

  return (
      <div style={{ background: '#F4F6FB', minHeight: '100vh', padding: '24px', userSelect: 'none' }}>
        <Breadcrumb>
          <Breadcrumb.Item href="#">Trang Chủ</Breadcrumb.Item>
          <Breadcrumb.Item active>Hình Ảnh</Breadcrumb.Item>
        </Breadcrumb>

        <div className="bg-white p-3 rounded shadow-sm">
          <div className="d-flex justify-content-between flex-wrap gap-2 mb-3">
            <InputGroup style={{ maxWidth: 300 }}>
              <Form.Control placeholder="Tìm mô tả ảnh" value={search} onChange={(e) => setSearch(e.target.value)} />
            </InputGroup>

            <Form.Select style={{ maxWidth: 200 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="Tất cả">Tất cả trạng thái</option>
              <option value="Hiển thị">Hiển thị</option>
              <option value="Ẩn">Ẩn</option>
            </Form.Select>

            <div className="d-flex gap-2">
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary">☰</Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#scan">
                    <FaQrcode className="me-2" />
                    Quét mã
                  </Dropdown.Item>
                  <Dropdown.Item href="#export">📥 Export</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <Button variant="primary" onClick={handleShowAddModal}>
                <FaPlus className="me-1" />
                Thêm hình ảnh
              </Button>
            </div>
          </div>

          <Table hover responsive>
            <thead>
            <tr>
              <th>STT</th>
              <th>Ảnh</th>
              <th>Mô tả</th>
              <th>Mặc định</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
            </thead>
            <tbody>
            {filteredImages.map((img, index) => (
                <tr key={img.ma_anh}>
                  <td>{index + 1}</td>
                  <td>
                    <img src={img.duong_dan_anh} alt="Ảnh" style={{ width: 60, height: 60, objectFit: 'cover' }} />
                  </td>
                  <td>{img.mo_ta}</td>
                  <td>{img.anh_mac_dinh ? <Badge bg="info">Mặc định</Badge> : ''}</td>
                  <td>
                    <Badge bg={img.trang_thai === 'Hiển thị' ? 'success' : 'secondary'}>{img.trang_thai}</Badge>
                  </td>
                  <td className="text-center">
                    <Dropdown align="end">
                      <Dropdown.Toggle variant="light" className="rounded-circle border-0">
                        ⋮
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => alert(`Chi tiết ảnh ${img.ma_anh}`)}>Chi tiết</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleShowEditModal(img)}>Sửa</Dropdown.Item>
                        <Dropdown.Item onClick={() => alert(`Xóa ảnh ${img.ma_anh}`)}>Xóa</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
            ))}
            </tbody>
          </Table>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <Form.Select size="sm" style={{ maxWidth: 120 }}>
              <option>Xem 5</option>
              <option>Xem 10</option>
              <option>Xem 20</option>
            </Form.Select>
            <Pagination>
              <Pagination.Prev />
              <Pagination.Item active>1</Pagination.Item>
              <Pagination.Item>2</Pagination.Item>
              <Pagination.Next />
            </Pagination>
          </div>
        </div>

        {/* Modal thêm/sửa hình ảnh */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{editingImage ? 'Sửa hình ảnh' : 'Thêm hình ảnh'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="maAnh">
                <Form.Label>Mã ảnh</Form.Label>
                <Form.Control
                    type="text"
                    name="ma_anh"
                    value={formData.ma_anh}
                    onChange={handleChange}
                    disabled={!!editingImage}
                    placeholder="Nhập mã ảnh"
                />
              </Form.Group>

              <StyledWrapper>
                <form className="form" onSubmit={(e) => e.preventDefault()}>
                  <label htmlFor="file-input" className="drop-container">
                    <span className="drop-title">Thả tệp vào đây</span>
                    hoặc
                    <input type="file" accept="image/*" required={!editingImage} id="file-input" onChange={handleChange} />
                  </label>
                  {previewImg && <img src={previewImg} alt="Preview" className="preview-img" />}
                </form>
              </StyledWrapper>

              <Form.Group className="mb-3" controlId="moTa">
                <Form.Label>Mô tả</Form.Label>
                <Form.Control type="text" name="mo_ta" value={formData.mo_ta} onChange={handleChange} placeholder="Nhập mô tả" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="anhMacDinh">
                <Form.Check
                    type="checkbox"
                    label="Ảnh mặc định"
                    name="anh_mac_dinh"
                    checked={formData.anh_mac_dinh}
                    onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="trangThai">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select name="trang_thai" value={formData.trang_thai} onChange={handleChange}>
                  <option>Hiển thị</option>
                  <option>Ẩn</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Đóng
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Lưu
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
  );
};

const StyledWrapper = styled.div`
  .form {
    background-color: #fff;
    box-shadow: 0 10px 60px rgb(218 229 255);
    border: 1px solid rgb(159 159 160);
    border-radius: 20px;
    padding: 2rem 0.7rem 0.7rem 0.7rem;
    text-align: center;
    font-size: 1.125rem;
    max-width: 100%;
    margin: 0 auto;
    width: 100%;
  }

  .form-title {
    color: #000;
    font-size: 1.8rem;
    font-weight: 500;
  }

  .form-paragraph {
    margin-top: 10px;
    font-size: 0.9375rem;
    color: rgb(105 105 105);
  }

  .drop-container {
    background-color: #fff;
    position: relative;
    display: flex;
    gap: 10px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
    margin-top: 2.1875rem;
    border-radius: 10px;
    border: 2px dashed rgb(171 202 255);
    color: #444;
    cursor: pointer;
    transition:
        background 0.2s ease-in-out,
        border 0.2s ease-in-out;
  }

  .drop-container:hover {
    background: rgba(0, 140, 255, 0.164);
    border-color: rgba(17, 17, 17, 0.616);
  }

  .drop-container:hover .drop-title {
    color: #222;
  }

  .drop-title {
    color: #444;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    transition: color 0.2s ease-in-out;
  }

  #file-input {
    width: 350px;
    max-width: 100%;
    color: #444;
    padding: 2px;
    background: #fff;
    border-radius: 10px;
    border: 1px solid rgba(8, 8, 8, 0.288);
  }

  #file-input::file-selector-button {
    margin-right: 20px;
    border: none;
    background: #084cdf;
    padding: 10px 20px;
    border-radius: 10px;
    color: #fff;
    cursor: pointer;
    transition: background 0.2s ease-in-out;
  }

  #file-input::file-selector-button:hover {
    background: #0d45a5;
  }

  .preview-img {
    margin-top: 10px;
    max-width: 100%;
    max-height: 200px;
    object-fit: contain;
    border-radius: 10px;
  }
`;

export default ImageTable;