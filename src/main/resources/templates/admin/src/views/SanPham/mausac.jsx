import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Form,
  InputGroup,
  Pagination,
  Dropdown,
  Breadcrumb,
  Modal,
} from 'react-bootstrap';
import { FaPlus, FaQrcode } from 'react-icons/fa';
import axios from '../../axiosConfig';

const ColorTable = () => {
  const [colorsData, setColorsData] = useState({
    content: [],
    totalPages: 0,
    number: 0,
    first: true,
    last: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [newColor, setNewColor] = useState({
    maMau: '',
    tenMauSac: '',
    trangThai: 1,
  });

  const [editingColor, setEditingColor] = useState(null);

  const [queryParams, setQueryParams] = useState({
    page: 0,
    size: 5,
    tenMauSac: '',
    trangThai: 'Tất cả',
  });

  const fetchColors = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { ...queryParams };
      if (params.trangThai === 'Tất cả') {
        delete params.trangThai;
      }
      const response = await axios.get('/mauSac', { params });
      setColorsData(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColors();
    // eslint-disable-next-line
  }, [queryParams]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newColor.maMau.trim() || !newColor.tenMauSac.trim()) {
      alert('Vui lòng nhập đủ mã và tên màu sắc');
      return;
    }
    try {
      await axios.post('/mauSac', newColor);
      setShowAddModal(false);
      setNewColor({
        maMau: '',
        tenMauSac: '',
        trangThai: 1,
      });
      fetchColors();
    } catch (error) {
      console.error('Lỗi khi thêm:', error);
      alert('Có lỗi xảy ra khi thêm màu sắc!');
    }
  };

  const handleEditClick = (color) => {
    setEditingColor({
      id: color.id,
      maMau: color.maMau,
      tenMauSac: color.tenMauSac,
      trangThai: color.trangThai,
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingColor?.maMau?.trim() || !editingColor?.tenMauSac?.trim()) {
      alert('Vui lòng nhập đủ mã và tên màu sắc');
      return;
    }
    try {
      await axios.put(`/mauSac/${editingColor.id}`, {
        maMau: editingColor.maMau,
        tenMauSac: editingColor.tenMauSac,
        trangThai: editingColor.trangThai,
      });
      setShowEditModal(false);
      setEditingColor(null);
      fetchColors();
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
      alert('Có lỗi xảy ra khi cập nhật màu sắc!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa màu sắc này?')) {
      try {
        await axios.delete(`/mauSac/${id}`);
        fetchColors();
      } catch (error) {
        console.error('Lỗi khi xóa:', error);
        alert('Có lỗi xảy ra khi xóa màu sắc!');
      }
    }
  };

  const getTrangThaiText = (trangThai) =>
      trangThai === 1 || trangThai === 'Hiển thị' ? 'Hiển thị' : 'Ẩn';

  return (
      <div
          style={{
            background: '#f5f6fa',
            minHeight: '100vh',
            padding: '24px',
            userSelect: 'none',
          }}
      >
        <Breadcrumb>
          <Breadcrumb.Item href="/">Trang Chủ</Breadcrumb.Item>
          <Breadcrumb.Item active>Màu Sắc</Breadcrumb.Item>
        </Breadcrumb>

        <div className="bg-white p-3 rounded shadow-sm">
          {/* Top actions */}
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
            {/* Search */}
            <InputGroup style={{ maxWidth: 300 }}>
              <Form.Control
                  placeholder="Tìm màu sắc"
                  value={queryParams.tenMauSac}
                  onChange={(e) =>
                      setQueryParams({
                        ...queryParams,
                        tenMauSac: e.target.value,
                        page: 0,
                      })
                  }
              />
            </InputGroup>

            {/* Status filter */}
            <Form.Select
                style={{ maxWidth: 200 }}
                value={queryParams.trangThai}
                onChange={(e) =>
                    setQueryParams({
                      ...queryParams,
                      trangThai: e.target.value,
                      page: 0,
                    })
                }
            >
              <option value="Tất cả">Tất cả trạng thái</option>
              <option value={1}>Hiển thị</option>
              <option value={0}>Ẩn</option>
            </Form.Select>

            {/* Action buttons */}
            <div className="d-flex flex-wrap align-items-center gap-2">
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

              <Button variant="primary" onClick={() => setShowAddModal(true)}>
                <FaPlus className="me-1" />
                Thêm màu sắc
              </Button>
            </div>
          </div>

          {/* Table */}
          {error ? (
              <div className="alert alert-danger">{error}</div>
          ) : (
              <Table hover responsive>
                <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã</th>
                  <th>Tên</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
                </thead>
                <tbody>
                {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center">
                        <div className="spinner-border" role="status">
                          <span className="visually-hidden">Đang tải...</span>
                        </div>
                      </td>
                    </tr>
                ) : colorsData.content?.length > 0 ? (
                    colorsData.content.map((color, index) => (
                        <tr key={color.id}>
                          <td>{queryParams.page * queryParams.size + index + 1}</td>
                          <td>{color.maMau || ''}</td>
                          <td>{color.tenMauSac}</td>
                          <td>
                      <span
                          className={`badge ${
                              getTrangThaiText(color.trangThai) === 'Hiển thị'
                                  ? 'bg-success'
                                  : 'bg-secondary'
                          }`}
                      >
                        {getTrangThaiText(color.trangThai)}
                      </span>
                          </td>
                          <td className="text-center">
                            <Dropdown align="end">
                              <Dropdown.Toggle
                                  variant="light"
                                  className="rounded-circle border-0"
                              >
                                ⋮
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleEditClick(color)}>
                                  Sửa
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handleDelete(color.id)}>
                                  Xóa
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        Không có dữ liệu
                      </td>
                    </tr>
                )}
                </tbody>
              </Table>
          )}

          {/* Pagination + View control */}
          {!loading && colorsData.content?.length > 0 && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <Form.Select
                    size="sm"
                    style={{ maxWidth: 120 }}
                    value={queryParams.size}
                    onChange={(e) =>
                        setQueryParams({
                          ...queryParams,
                          size: Number(e.target.value),
                          page: 0,
                        })
                    }
                >
                  <option value={5}>Xem 5</option>
                  <option value={10}>Xem 10</option>
                  <option value={20}>Xem 20</option>
                </Form.Select>

                <Pagination>
                  <Pagination.Prev
                      disabled={colorsData.first}
                      onClick={() =>
                          setQueryParams({
                            ...queryParams,
                            page: queryParams.page - 1,
                          })
                      }
                  />
                  {[...Array(colorsData.totalPages)].map((_, idx) => (
                      <Pagination.Item
                          key={idx}
                          active={idx === colorsData.number}
                          onClick={() =>
                              setQueryParams({
                                ...queryParams,
                                page: idx,
                              })
                          }
                      >
                        {idx + 1}
                      </Pagination.Item>
                  ))}
                  <Pagination.Next
                      disabled={colorsData.last}
                      onClick={() =>
                          setQueryParams({
                            ...queryParams,
                            page: queryParams.page + 1,
                          })
                      }
                  />
                </Pagination>
              </div>
          )}
        </div>

        {/* Modal Thêm mới */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Thêm màu sắc mới</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleAdd}>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="formMaMau">
                <Form.Label>Mã màu sắc</Form.Label>
                <Form.Control
                    required
                    type="text"
                    value={newColor.maMau}
                    onChange={(e) =>
                        setNewColor({
                          ...newColor,
                          maMau: e.target.value,
                        })
                    }
                    autoFocus
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formTenMauSac">
                <Form.Label>Tên màu sắc</Form.Label>
                <Form.Control
                    required
                    type="text"
                    value={newColor.tenMauSac}
                    onChange={(e) =>
                        setNewColor({
                          ...newColor,
                          tenMauSac: e.target.value,
                        })
                    }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formTrangThai">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select
                    value={newColor.trangThai}
                    onChange={(e) =>
                        setNewColor({
                          ...newColor,
                          trangThai: Number(e.target.value),
                        })
                    }
                >
                  <option value={1}>Hiển thị</option>
                  <option value={0}>Ẩn</option>
                </Form.Select>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                  variant="secondary"
                  onClick={() => setShowAddModal(false)}
              >
                Hủy
              </Button>
              <Button variant="primary" type="submit">
                Thêm
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Modal Chỉnh sửa */}
        <Modal
            show={showEditModal}
            onHide={() => setShowEditModal(false)}
            centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Sửa màu sắc</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleUpdate}>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="formMaMauEdit">
                <Form.Label>Mã màu sắc</Form.Label>
                <Form.Control
                    required
                    type="text"
                    value={editingColor?.maMau || ''}
                    onChange={(e) =>
                        setEditingColor({
                          ...editingColor,
                          maMau: e.target.value,
                        })
                    }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formTenMauSacEdit">
                <Form.Label>Tên màu sắc</Form.Label>
                <Form.Control
                    required
                    type="text"
                    value={editingColor?.tenMauSac || ''}
                    onChange={(e) =>
                        setEditingColor({
                          ...editingColor,
                          tenMauSac: e.target.value,
                        })
                    }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formTrangThaiEdit">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select
                    value={editingColor?.trangThai ?? 1}
                    onChange={(e) =>
                        setEditingColor({
                          ...editingColor,
                          trangThai: Number(e.target.value),
                        })
                    }
                >
                  <option value={1}>Hiển thị</option>
                  <option value={0}>Ẩn</option>
                </Form.Select>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                  variant="secondary"
                  onClick={() => setShowEditModal(false)}
              >
                Hủy
              </Button>
              <Button variant="primary" type="submit">
                Lưu
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
  );
};

export default ColorTable;