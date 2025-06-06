import React, { useState, useEffect } from 'react';
import {
  Table, Button, Form, InputGroup, Pagination, Dropdown, Breadcrumb, Modal
} from 'react-bootstrap';
import { FaPlus, FaQrcode } from 'react-icons/fa';
import axios from '../../axiosConfig';

const MaterialTable = () => {
  const [materials, setMaterials] = useState({
    content: [],
    totalPages: 0,
    number: 0,
    first: true,
    last: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Bổ sung trường maChatLieu và trangThai cho newMaterial
  const [newMaterial, setNewMaterial] = useState({
    maChatLieu: '',
    tenChatLieu: '',
    trangThai: 1,
  });

  const [editingMaterial, setEditingMaterial] = useState(null);

  const [queryParams, setQueryParams] = useState({
    page: 0,
    size: 5,
    tenChatLieu: '',
    trangThai: 'Tất cả'
  });

  const fetchMaterials = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { ...queryParams };
      if (params.trangThai === 'Tất cả') {
        delete params.trangThai;
      }
      const response = await axios.get('/chatLieu', { params });
      setMaterials(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
    // eslint-disable-next-line
  }, [queryParams]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newMaterial.maChatLieu.trim() || !newMaterial.tenChatLieu.trim()) {
      alert('Vui lòng nhập đủ mã và tên chất liệu');
      return;
    }
    try {
      await axios.post('/chatLieu', newMaterial);
      setShowAddModal(false);
      setNewMaterial({
        maChatLieu: '',
        tenChatLieu: '',
        trangThai: 1
      });
      fetchMaterials();
    } catch (error) {
      console.error('Lỗi khi thêm:', error);
      alert('Có lỗi xảy ra khi thêm chất liệu!');
    }
  };

  const handleEditClick = (material) => {
    setEditingMaterial({
      id: material.id,
      maChatLieu: material.maChatLieu,
      tenChatLieu: material.tenChatLieu,
      trangThai: material.trangThai
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingMaterial?.maChatLieu?.trim() || !editingMaterial?.tenChatLieu?.trim()) {
      alert('Vui lòng nhập đủ mã và tên chất liệu');
      return;
    }
    try {
      await axios.put(`/chatLieu/${editingMaterial.id}`, {
        maChatLieu: editingMaterial.maChatLieu,
        tenChatLieu: editingMaterial.tenChatLieu,
        trangThai: editingMaterial.trangThai
      });
      setShowEditModal(false);
      setEditingMaterial(null);
      fetchMaterials();
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
      alert('Có lỗi xảy ra khi cập nhật chất liệu!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chất liệu này?')) {
      try {
        await axios.delete(`/chatLieu/${id}`);
        fetchMaterials();
      } catch (error) {
        console.error('Lỗi khi xóa:', error);
        alert('Có lỗi xảy ra khi xóa chất liệu!');
      }
    }
  };

  const getTrangThaiText = (trangThai) =>
      trangThai === 1 || trangThai === 'Hiển thị' ? 'Hiển thị' : 'Ẩn';

  return (
      <div style={{ background: '#f5f6fa', minHeight: '100vh', padding: '24px', userSelect: 'none' }}>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Trang Chủ</Breadcrumb.Item>
          <Breadcrumb.Item active>Chất Liệu</Breadcrumb.Item>
        </Breadcrumb>

        <div className="bg-white p-3 rounded shadow-sm" style={{ userSelect: 'none' }}>
          {/* Top actions */}
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
            {/* Search */}
            <InputGroup style={{ maxWidth: 300 }}>
              <Form.Control
                  placeholder="Tìm chất liệu"
                  value={queryParams.tenChatLieu}
                  onChange={(e) =>
                      setQueryParams({
                        ...queryParams,
                        tenChatLieu: e.target.value,
                        page: 0
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
                      page: 0
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
                Thêm chất liệu
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
                ) : materials.content?.length > 0 ? (
                    materials.content.map((material, index) => (
                        <tr key={material.id}>
                          <td>{queryParams.page * queryParams.size + index + 1}</td>
                          <td>{material.maChatLieu || ''}</td>
                          <td>{material.tenChatLieu}</td>
                          <td>
                            <span className={`badge ${getTrangThaiText(material.trangThai) === 'Hiển thị' ? 'bg-success' : 'bg-secondary'}`}>
                              {getTrangThaiText(material.trangThai)}
                            </span>
                          </td>
                          <td className="text-center">
                            <Dropdown align="end">
                              <Dropdown.Toggle variant="light" className="rounded-circle border-0">
                                ⋮
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleEditClick(material)}>
                                  Sửa
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handleDelete(material.id)}>
                                  Xóa
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                      <td colSpan="5" className="text-center">Không có dữ liệu</td>
                    </tr>
                )}
                </tbody>
              </Table>
          )}

          {/* Pagination + View control */}
          {!loading && materials.content?.length > 0 && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <Form.Select
                    size="sm"
                    style={{ maxWidth: 120 }}
                    value={queryParams.size}
                    onChange={(e) =>
                        setQueryParams({
                          ...queryParams,
                          size: Number(e.target.value),
                          page: 0
                        })
                    }
                >
                  <option value={5}>Xem 5</option>
                  <option value={10}>Xem 10</option>
                  <option value={20}>Xem 20</option>
                </Form.Select>

                <Pagination>
                  <Pagination.Prev
                      disabled={materials.first}
                      onClick={() =>
                          setQueryParams({
                            ...queryParams,
                            page: queryParams.page - 1
                          })
                      }
                  />
                  {[...Array(materials.totalPages)].map((_, idx) => (
                      <Pagination.Item
                          key={idx}
                          active={idx === materials.number}
                          onClick={() =>
                              setQueryParams({
                                ...queryParams,
                                page: idx
                              })
                          }
                      >
                        {idx + 1}
                      </Pagination.Item>
                  ))}
                  <Pagination.Next
                      disabled={materials.last}
                      onClick={() =>
                          setQueryParams({
                            ...queryParams,
                            page: queryParams.page + 1
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
            <Modal.Title>Thêm chất liệu mới</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleAdd}>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="formMaChatLieu">
                <Form.Label>Mã chất liệu</Form.Label>
                <Form.Control
                    required
                    type="text"
                    value={newMaterial.maChatLieu}
                    onChange={(e) =>
                        setNewMaterial({
                          ...newMaterial,
                          maChatLieu: e.target.value
                        })
                    }
                    autoFocus
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formTenChatLieu">
                <Form.Label>Tên chất liệu</Form.Label>
                <Form.Control
                    required
                    type="text"
                    value={newMaterial.tenChatLieu}
                    onChange={(e) =>
                        setNewMaterial({
                          ...newMaterial,
                          tenChatLieu: e.target.value
                        })
                    }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formTrangThai">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select
                    value={newMaterial.trangThai}
                    onChange={(e) =>
                        setNewMaterial({
                          ...newMaterial,
                          trangThai: Number(e.target.value)
                        })
                    }
                >
                  <option value={1}>Hiển thị</option>
                  <option value={0}>Ẩn</option>
                </Form.Select>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                Hủy
              </Button>
              <Button variant="primary" type="submit">
                Thêm
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Modal Chỉnh sửa */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Sửa chất liệu</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleUpdate}>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="formMaChatLieuEdit">
                <Form.Label>Mã chất liệu</Form.Label>
                <Form.Control
                    required
                    type="text"
                    value={editingMaterial?.maChatLieu || ''}
                    onChange={(e) =>
                        setEditingMaterial({
                          ...editingMaterial,
                          maChatLieu: e.target.value
                        })
                    }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formTenChatLieuEdit">
                <Form.Label>Tên chất liệu</Form.Label>
                <Form.Control
                    required
                    type="text"
                    value={editingMaterial?.tenChatLieu || ''}
                    onChange={(e) =>
                        setEditingMaterial({
                          ...editingMaterial,
                          tenChatLieu: e.target.value
                        })
                    }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formTrangThaiEdit">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select
                    value={editingMaterial?.trangThai ?? 1}
                    onChange={(e) =>
                        setEditingMaterial({
                          ...editingMaterial,
                          trangThai: Number(e.target.value)
                        })
                    }
                >
                  <option value={1}>Hiển thị</option>
                  <option value={0}>Ẩn</option>
                </Form.Select>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
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

export default MaterialTable;