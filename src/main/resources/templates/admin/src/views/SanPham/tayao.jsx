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

const SleeveTable = () => {
  const [sleevesData, setSleevesData] = useState({
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

  const [newSleeve, setNewSleeve] = useState({
    ma: '',
    tenTayAo: '',
    trangThai: 1,
  });

  const [editingSleeve, setEditingSleeve] = useState(null);

  const [queryParams, setQueryParams] = useState({
    page: 0,
    size: 5,
    tenTayAo: '',
    trangThai: 'Tất cả',
  });

  const fetchSleeves = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { ...queryParams };
      if (params.trangThai === 'Tất cả') {
        delete params.trangThai;
      }
      const response = await axios.get('/tayAo', { params });
      setSleevesData(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSleeves();
    // eslint-disable-next-line
  }, [queryParams]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newSleeve.ma.trim() || !newSleeve.tenTayAo.trim()) {
      alert('Vui lòng nhập đủ mã và tên tay áo');
      return;
    }
    try {
      await axios.post('/tayAo', newSleeve);
      setShowAddModal(false);
      setNewSleeve({
        ma: '',
        tenTayAo: '',
        trangThai: 1,
      });
      fetchSleeves();
    } catch (error) {
      console.error('Lỗi khi thêm:', error);
      alert('Có lỗi xảy ra khi thêm tay áo!');
    }
  };

  const handleEditClick = (sleeve) => {
    setEditingSleeve({
      id: sleeve.id,
      ma: sleeve.ma,
      tenTayAo: sleeve.tenTayAo,
      trangThai: sleeve.trangThai,
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingSleeve?.ma?.trim() || !editingSleeve?.tenTayAo?.trim()) {
      alert('Vui lòng nhập đủ mã và tên tay áo');
      return;
    }
    try {
      await axios.put(`/tayAo/${editingSleeve.id}`, {
        ma: editingSleeve.ma,
        tenTayAo: editingSleeve.tenTayAo,
        trangThai: editingSleeve.trangThai,
      });
      setShowEditModal(false);
      setEditingSleeve(null);
      fetchSleeves();
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
      alert('Có lỗi xảy ra khi cập nhật tay áo!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tay áo này?')) {
      try {
        await axios.delete(`/tayAo/${id}`);
        fetchSleeves();
      } catch (error) {
        console.error('Lỗi khi xóa:', error);
        alert('Có lỗi xảy ra khi xóa tay áo!');
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
          <Breadcrumb.Item active>Tay Áo</Breadcrumb.Item>
        </Breadcrumb>

        <div className="bg-white p-3 rounded shadow-sm">
          {/* Top actions */}
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
            {/* Search */}
            <InputGroup style={{ maxWidth: 300 }}>
              <Form.Control
                  placeholder="Tìm tay áo"
                  value={queryParams.tenTayAo}
                  onChange={(e) =>
                      setQueryParams({
                        ...queryParams,
                        tenTayAo: e.target.value,
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
                Thêm tay áo
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
                ) : sleevesData.content?.length > 0 ? (
                    sleevesData.content.map((sleeve, index) => (
                        <tr key={sleeve.id}>
                          <td>{queryParams.page * queryParams.size + index + 1}</td>
                          <td>{sleeve.ma || ''}</td>
                          <td>{sleeve.tenTayAo}</td>
                          <td>
                      <span
                          className={`badge ${
                              getTrangThaiText(sleeve.trangThai) === 'Hiển thị'
                                  ? 'bg-success'
                                  : 'bg-secondary'
                          }`}
                      >
                        {getTrangThaiText(sleeve.trangThai)}
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
                                <Dropdown.Item onClick={() => handleEditClick(sleeve)}>
                                  Sửa
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handleDelete(sleeve.id)}>
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
          {!loading && sleevesData.content?.length > 0 && (
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
                      disabled={sleevesData.first}
                      onClick={() =>
                          setQueryParams({
                            ...queryParams,
                            page: queryParams.page - 1,
                          })
                      }
                  />
                  {[...Array(sleevesData.totalPages)].map((_, idx) => (
                      <Pagination.Item
                          key={idx}
                          active={idx === sleevesData.number}
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
                      disabled={sleevesData.last}
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
            <Modal.Title>Thêm tay áo mới</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleAdd}>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="formMaTayAo">
                <Form.Label>Mã tay áo</Form.Label>
                <Form.Control
                    required
                    type="text"
                    value={newSleeve.ma}
                    onChange={(e) =>
                        setNewSleeve({
                          ...newSleeve,
                          ma: e.target.value,
                        })
                    }
                    autoFocus
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formTenTayAo">
                <Form.Label>Tên tay áo</Form.Label>
                <Form.Control
                    required
                    type="text"
                    value={newSleeve.tenTayAo}
                    onChange={(e) =>
                        setNewSleeve({
                          ...newSleeve,
                          tenTayAo: e.target.value,
                        })
                    }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formTrangThai">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select
                    value={newSleeve.trangThai}
                    onChange={(e) =>
                        setNewSleeve({
                          ...newSleeve,
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
            <Modal.Title>Sửa tay áo</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleUpdate}>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="formMaTayAoEdit">
                <Form.Label>Mã tay áo</Form.Label>
                <Form.Control
                    required
                    type="text"
                    value={editingSleeve?.ma || ''}
                    onChange={(e) =>
                        setEditingSleeve({
                          ...editingSleeve,
                          ma: e.target.value,
                        })
                    }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formTenTayAoEdit">
                <Form.Label>Tên tay áo</Form.Label>
                <Form.Control
                    required
                    type="text"
                    value={editingSleeve?.tenTayAo || ''}
                    onChange={(e) =>
                        setEditingSleeve({
                          ...editingSleeve,
                          tenTayAo: e.target.value,
                        })
                    }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formTrangThaiEdit">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select
                    value={editingSleeve?.trangThai ?? 1}
                    onChange={(e) =>
                        setEditingSleeve({
                          ...editingSleeve,
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

export default SleeveTable;