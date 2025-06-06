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

const CollarTable = () => {
  const [collarsData, setCollarsData] = useState({
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

  const [newCollar, setNewCollar] = useState({
    ma: '',
    tenCoAo: '',
    trangThai: 1,
  });

  const [editingCollar, setEditingCollar] = useState(null);

  const [queryParams, setQueryParams] = useState({
    page: 0,
    size: 5,
    tenCoAo: '',
    trangThai: 'Tất cả',
  });

  const fetchCollars = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { ...queryParams };
      if (params.trangThai === 'Tất cả') {
        delete params.trangThai;
      }
      const response = await axios.get('/coAo', { params });
      setCollarsData(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollars();
    // eslint-disable-next-line
  }, [queryParams]);

  // CHỈNH SỬA: Xử lý trạng thái dạng số khi Add
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCollar.ma.trim() || !newCollar.tenCoAo.trim()) {
      alert('Vui lòng nhập đủ mã và tên cổ áo');
      return;
    }
    // Đảm bảo trạng thái là số (1 hoặc 0)
    const collarToAdd = {
      ...newCollar,
      trangThai: Number(newCollar.trangThai),
    };
    try {
      await axios.post('/coAo', collarToAdd);
      setShowAddModal(false);
      setNewCollar({
        ma: '',
        tenCoAo: '',
        trangThai: 1,
      });
      fetchCollars();
    } catch (error) {
      console.error('Lỗi khi thêm:', error);
      alert('Có lỗi xảy ra khi thêm cổ áo!');
    }
  };

  // CHỈNH SỬA: Xử lý trạng thái dạng số khi Sửa
  const handleEditClick = (collar) => {
    setEditingCollar({
      id: collar.id,
      ma: collar.ma,
      tenCoAo: collar.tenCoAo,
      // Đảm bảo trạng thái là số (có thể nhận từ backend là chuỗi)
      trangThai: typeof collar.trangThai === 'number' ? collar.trangThai : (collar.trangThai === 'Hiển thị' ? 1 : 0),
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingCollar?.ma?.trim() || !editingCollar?.tenCoAo?.trim()) {
      alert('Vui lòng nhập đủ mã và tên cổ áo');
      return;
    }
    // Đảm bảo trạng thái là số (1 hoặc 0)
    const collarToUpdate = {
      ma: editingCollar.ma,
      tenCoAo: editingCollar.tenCoAo,
      trangThai: Number(editingCollar.trangThai),
    };
    try {
      await axios.put(`/coAo/${editingCollar.id}`, collarToUpdate);
      setShowEditModal(false);
      setEditingCollar(null);
      fetchCollars();
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
      alert('Có lỗi xảy ra khi cập nhật cổ áo!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa cổ áo này?')) {
      try {
        await axios.delete(`/coAo/${id}`);
        fetchCollars();
      } catch (error) {
        console.error('Lỗi khi xóa:', error);
        alert('Có lỗi xảy ra khi xóa cổ áo!');
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
          <Breadcrumb.Item active>Cổ Áo</Breadcrumb.Item>
        </Breadcrumb>

        <div className="bg-white p-3 rounded shadow-sm">
          {/* Top actions */}
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
            {/* Search */}
            <InputGroup style={{ maxWidth: 300 }}>
              <Form.Control
                  placeholder="Tìm cổ áo"
                  value={queryParams.tenCoAo}
                  onChange={(e) =>
                      setQueryParams({
                        ...queryParams,
                        tenCoAo: e.target.value,
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
                Thêm cổ áo
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
                ) : collarsData.content?.length > 0 ? (
                    collarsData.content.map((collar, index) => (
                        <tr key={collar.id}>
                          <td>{queryParams.page * queryParams.size + index + 1}</td>
                          <td>{collar.ma || ''}</td>
                          <td>{collar.tenCoAo}</td>
                          <td>
                      <span
                          className={`badge ${
                              getTrangThaiText(collar.trangThai) === 'Hiển thị'
                                  ? 'bg-success'
                                  : 'bg-secondary'
                          }`}
                      >
                        {getTrangThaiText(collar.trangThai)}
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
                                <Dropdown.Item onClick={() => handleEditClick(collar)}>
                                  Sửa
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handleDelete(collar.id)}>
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
          {!loading && collarsData.content?.length > 0 && (
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
                      disabled={collarsData.first}
                      onClick={() =>
                          setQueryParams({
                            ...queryParams,
                            page: queryParams.page - 1,
                          })
                      }
                  />
                  {[...Array(collarsData.totalPages)].map((_, idx) => (
                      <Pagination.Item
                          key={idx}
                          active={idx === collarsData.number}
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
                      disabled={collarsData.last}
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
            <Modal.Title>Thêm cổ áo mới</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleAdd}>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="formMaCoAo">
                <Form.Label>Mã cổ áo</Form.Label>
                <Form.Control
                    required
                    type="text"
                    value={newCollar.ma}
                    onChange={(e) =>
                        setNewCollar({
                          ...newCollar,
                          ma: e.target.value,
                        })
                    }
                    autoFocus
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formTenCoAo">
                <Form.Label>Tên cổ áo</Form.Label>
                <Form.Control
                    required
                    type="text"
                    value={newCollar.tenCoAo}
                    onChange={(e) =>
                        setNewCollar({
                          ...newCollar,
                          tenCoAo: e.target.value,
                        })
                    }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formTrangThai">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select
                    value={newCollar.trangThai}
                    onChange={(e) =>
                        setNewCollar({
                          ...newCollar,
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
            <Modal.Title>Sửa cổ áo</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleUpdate}>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="formMaCoAoEdit">
                <Form.Label>Mã cổ áo</Form.Label>
                <Form.Control
                    required
                    type="text"
                    value={editingCollar?.ma || ''}
                    onChange={(e) =>
                        setEditingCollar({
                          ...editingCollar,
                          ma: e.target.value,
                        })
                    }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formTenCoAoEdit">
                <Form.Label>Tên cổ áo</Form.Label>
                <Form.Control
                    required
                    type="text"
                    value={editingCollar?.tenCoAo || ''}
                    onChange={(e) =>
                        setEditingCollar({
                          ...editingCollar,
                          tenCoAo: e.target.value,
                        })
                    }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formTrangThaiEdit">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select
                    value={editingCollar?.trangThai ?? 1}
                    onChange={(e) =>
                        setEditingCollar({
                          ...editingCollar,
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

export default CollarTable;