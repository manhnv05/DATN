import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Table,
  Button,
  Form,
  InputGroup,
  Dropdown,
  Breadcrumb,
  Pagination,
  Badge,
  Modal
} from 'react-bootstrap';
import { FaPlus, FaQrcode } from 'react-icons/fa';
import axios from '../../axiosConfig';


const PAGE_SIZE_OPTIONS = [5, 10, 20];

const statusToInt = (trang_thai) => (trang_thai === 'Hiển thị' || trang_thai === 1 ? 1 : 0);
const intToStatus = (trang_thai) => (trang_thai === 1 ? 'Hiển thị' : 'Ẩn');

// Hàm chuẩn hóa URL để tránh lỗi // khi ghép chuỗi
const normalizeUrl = (url) =>
    url.startsWith('http') ? url : `http://localhost:8080${url.startsWith('/') ? '' : '/'}${url}`;

const ImageTable = () => {
  const [images, setImages] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [showModal, setShowModal] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [previewImg, setPreviewImg] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [totalPages, setTotalPages] = useState(0);

  const [formData, setFormData] = useState({
    ma_anh: '',
    duong_dan_anh: null,
    anh_mac_dinh: false,
    mo_ta: '',
    trang_thai: 'Hiển thị'
  });

  const fetchImages = async () => {
    try {
      const params = {
        page,
        size,
        moTa: search,
        trangThai: statusFilter === 'Tất cả' ? undefined : statusToInt(statusFilter)
      };
      const { data } = await axios.get('/hinhAnh', { params });
      setImages(data.content.map(img => ({
        ...img,
        anh_mac_dinh: img.anhMacDinh === 1,
        trang_thai: intToStatus(img.trangThai)
      })));
      setTotalPages(data.totalPages);
    } catch (err) {
      setImages([]);
      setTotalPages(0);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [search, statusFilter, page, size]);

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
    setPreviewImg(img.duongDanAnh);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPreviewImg('');
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

  const handleSave = async () => {
    if (!formData.ma_anh.trim() || !formData.mo_ta.trim() || (!editingImage && !formData.duong_dan_anh)) {
      alert('Vui lòng nhập đầy đủ thông tin và chọn ảnh!');
      return;
    }

    const data = new FormData();
    data.append('ma_anh', formData.ma_anh);
    if (formData.duong_dan_anh) data.append('duong_dan_anh', formData.duong_dan_anh);
    data.append('anh_mac_dinh', formData.anh_mac_dinh ? 1 : 0);
    data.append('mo_ta', formData.mo_ta);
    data.append('trang_thai', statusToInt(formData.trang_thai));

    try {
      if (editingImage) {
        await axios.put(`/hinhAnh/${editingImage.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post('/hinhAnh', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setShowModal(false);
      fetchImages();
    } catch (error) {
      alert('Có lỗi xảy ra khi lưu hình ảnh!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hình ảnh này?')) {
      try {
        await axios.delete(`/hinhAnh/${id}`);
        fetchImages();
      } catch (error) {
        alert('Có lỗi xảy ra khi xóa hình ảnh!');
      }
    }
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
              <Form.Control
                  placeholder="Tìm mô tả ảnh"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(0);
                  }}
              />
            </InputGroup>

            <Form.Select
                style={{ maxWidth: 200 }}
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(0);
                }}
            >
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
            {images.length > 0 ? (
                images.map((img, index) => (
                    <tr key={img.id}>
                      <td>{page * size + index + 1}</td>
                      <td>
                        <img src={normalizeUrl(img.duongDanAnh)} alt="Ảnh" style={{ maxWidth: 80, maxHeight: 80, objectFit: 'cover', borderRadius: 6 }} />
                      </td>
                      <td>{img.moTa}</td>
                      <td>{img.anh_mac_dinh ? <Badge bg="info">Mặc định</Badge> : ''}</td>
                      <td>
                        <Badge bg={img.trang_thai === 'Hiển thị' ? 'success' : 'secondary'}>{img.trang_thai}</Badge>
                      </td>
                      <td className="text-center">
                        <Dropdown align="end">
                          <Dropdown.Toggle variant="light" className="rounded-circle border-0">⋮</Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => alert(`Chi tiết ảnh ${img.maAnh}`)}>Chi tiết</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleShowEditModal(img)}>Sửa</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleDelete(img.id)}>Xóa</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                ))
            ) : (
                <tr>
                  <td colSpan="6" className="text-center">Không có dữ liệu</td>
                </tr>
            )}
            </tbody>
          </Table>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <Form.Select
                size="sm"
                style={{ maxWidth: 120 }}
                value={size}
                onChange={(e) => {
                  setSize(Number(e.target.value));
                  setPage(0);
                }}
            >
              {PAGE_SIZE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>Xem {opt}</option>
              ))}
            </Form.Select>
            <Pagination>
              <Pagination.Prev disabled={page === 0} onClick={() => setPage(page - 1)} />
              {[...Array(totalPages)].map((_, idx) => (
                  <Pagination.Item
                      key={idx}
                      active={idx === page}
                      onClick={() => setPage(idx)}
                  >
                    {idx + 1}
                  </Pagination.Item>
              ))}
              <Pagination.Next disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)} />
            </Pagination>
          </div>
        </div>

        {/* Modal thêm/sửa */}
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
                <Form.Group controlId="fileInput" className="mb-3">
                  <Form.Label className="drop-title">Thả tệp vào đây hoặc chọn ảnh</Form.Label>
                  <Form.Control
                      type="file"
                      accept="image/*"
                      required={!editingImage}
                      name="duong_dan_anh"
                      onChange={handleChange}
                      className="drop-container"
                  />
                  {previewImg && <img src={previewImg} alt="Preview" className="preview-img" />}
                </Form.Group>
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
            <Button variant="secondary" onClick={handleCloseModal}>Đóng</Button>
            <Button variant="primary" onClick={handleSave}>Lưu</Button>
          </Modal.Footer>
        </Modal>
      </div>
  );
};

const StyledWrapper = styled.div`
  .drop-title {
    color: #444;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    transition: color 0.2s ease-in-out;
    margin-bottom: 10px;
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
    border-radius: 10px;
    border: 2px dashed #abcaff;
    color: #444;
    cursor: pointer;
    transition: background 0.2s ease-in-out, border 0.2s ease-in-out;
  }

  .drop-container:hover {
    background: rgba(0, 140, 255, 0.05);
    border-color: #008cff;
  }

  .preview-img {
    max-height: 150px;
    object-fit: contain;
    border: 1px solid #ddd;
    border-radius: 8px;
    margin-top: 10px;
  }
`;

export default ImageTable;