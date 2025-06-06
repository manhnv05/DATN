import React, { useState, useEffect } from 'react';
import {
  Table, Button, Form, InputGroup, Pagination, Dropdown, Breadcrumb, Modal
} from 'react-bootstrap';
import { FaPlus, FaQrcode } from 'react-icons/fa';
import axios from '../../axiosConfig';

const BrandTable = () => {
  const [brandsData, setBrandsData] = useState({
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

  const [newBrand, setNewBrand] = useState({
    maThuongHieu: '',
    tenThuongHieu: '',
    trangThai: 1,
  });

  const [editingBrand, setEditingBrand] = useState(null);

  const [queryParams, setQueryParams] = useState({
    page: 0,
    size: 5,
    tenThuongHieu: '',
    trangThai: 'Tất cả'
  });

  const fetchBrands = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { ...queryParams };
      if (params.trangThai === 'Tất cả') {
        delete params.trangThai;
      }
      const response = await axios.get('/thuongHieu', { params });
      setBrandsData(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
    // eslint-disable-next-line
  }, [queryParams]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newBrand.maThuongHieu.trim() || !newBrand.tenThuongHieu.trim()) {
      alert('Vui lòng nhập đủ mã và tên thương hiệu');
      return;
    }
    try {
      await axios.post('/thuongHieu', newBrand);
      setShowAddModal(false);
      setNewBrand({
        maThuongHieu: '',
        tenThuongHieu: '',
        trangThai: 1
      });
      fetchBrands();
    } catch (error) {
      console.error('Lỗi khi thêm:', error);
      alert('Có lỗi xảy ra khi thêm thương hiệu!');
    }
  };

  const handleEditClick = (brand) => {
    setEditingBrand({
      id: brand.id,
      maThuongHieu: brand.maThuongHieu,
      tenThuongHieu: brand.tenThuongHieu,
      trangThai: brand.trangThai
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingBrand?.maThuongHieu?.trim() || !editingBrand?.tenThuongHieu?.trim()) {
      alert('Vui lòng nhập đủ mã và tên thương hiệu');
      return;
    }
    try {
      await axios.put(`/thuongHieu/${editingBrand.id}`, {
        maThuongHieu: editingBrand.maThuongHieu,
        tenThuongHieu: editingBrand.tenThuongHieu,
        trangThai: editingBrand.trangThai
      });
      setShowEditModal(false);
      setEditingBrand(null);
      fetchBrands();
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
      alert('Có lỗi xảy ra khi cập nhật thương hiệu!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) {
      try {
        await axios.delete(`/thuongHieu/${id}`);
        fetchBrands();
      } catch (error) {
        console.error('Lỗi khi xóa:', error);
        alert('Có lỗi xảy ra khi xóa thương hiệu!');
      }
    }
  };

  const getTrangThaiText = (trangThai) =>
      trangThai === 1 || trangThai === 'Hiển thị' ? 'Hiển thị' : 'Ẩn';

  return (
      <div style={{ background: '#f5f6fa', minHeight: '100vh', padding: '24px', userSelect: 'none' }}>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Trang Chủ</Breadcrumb.Item>
          <Breadcrumb.Item active>Thương Hiệu</Breadcrumb.Item>
        </Breadcrumb>

        <div className="bg-white p-3 rounded shadow-sm" style={{ userSelect: 'none' }}>
          {/* Top actions */}
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
            {/* Search */}
            <InputGroup style={{ maxWidth: 300 }}>
              <Form.Control
                  placeholder="Tìm thương hiệu"
                  value={queryParams.tenThuongHieu}
                  onChange={(e) =>
                      setQueryParams({
                        ...queryParams,
                        tenThuongHieu: e.target.value,
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
                Thêm thương hiệu
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
                ) : brandsData.content?.length > 0 ? (
                    brandsData.content.map((brand, index) => (
                        <tr key={brand.id}>
                          <td>{queryParams.page * queryParams.size + index + 1}</td>
                          <td>{brand.maThuongHieu || ''}</td>
                          <td>{brand.tenThuongHieu}</td>
                          <td>
                      <span className={`badge ${getTrangThaiText(brand.trangThai) === 'Hiển thị' ? 'bg-success' : 'bg-secondary'}`}>
                        {getTrangThaiText(brand.trangThai)}
                      </span>
                          </td>
                          <td className="text-center">
                            <Dropdown align="end">
                              <Dropdown.Toggle variant="light" className="rounded-circle border-0">
                                ⋮
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleEditClick(brand)}>
                                  Sửa
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handleDelete(brand.id)}>
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
          {!loading && brandsData.content?.length > 0 && (
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
                      disabled={brandsData.first}
                      onClick={() =>
                          setQueryParams({
                            ...queryParams,
                            page: queryParams.page - 1
                          })
                      }
                  />
                  {[...Array(brandsData.totalPages)].map((_, idx) => (
                      <Pagination.Item
                          key={idx}
                          active={idx === brandsData.number}
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
                      disabled={brandsData.last}
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
            <Modal.Title>Thêm thương hiệu mới</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleAdd}>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="formMaThuongHieu">
                <Form.Label>Mã thương hiệu</Form.Label>
                <Form.Control
                    required
                    type="text"
                    value={newBrand.maThuongHieu}
                    onChange={(e) =>
                        setNewBrand({
                          ...newBrand,
                          maThuongHieu: e.target.value
                        })
                    }
                    autoFocus
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formTenThuongHieu">
                <Form.Label>Tên thương hiệu</Form.Label>
                <Form.Control
                    required
                    type="text"
                    value={newBrand.tenThuongHieu}
                    onChange={(e) =>
                        setNewBrand({
                          ...newBrand,
                          tenThuongHieu: e.target.value
                        })
                    }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formTrangThai">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select
                    value={newBrand.trangThai}
                    onChange={(e) =>
                        setNewBrand({
                          ...newBrand,
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
            <Modal.Title>Sửa thương hiệu</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleUpdate}>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="formMaThuongHieuEdit">
                <Form.Label>Mã thương hiệu</Form.Label>
                <Form.Control
                    required
                    type="text"
                    value={editingBrand?.maThuongHieu || ''}
                    onChange={(e) =>
                        setEditingBrand({
                          ...editingBrand,
                          maThuongHieu: e.target.value
                        })
                    }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formTenThuongHieuEdit">
                <Form.Label>Tên thương hiệu</Form.Label>
                <Form.Control
                    required
                    type="text"
                    value={editingBrand?.tenThuongHieu || ''}
                    onChange={(e) =>
                        setEditingBrand({
                          ...editingBrand,
                          tenThuongHieu: e.target.value
                        })
                    }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formTrangThaiEdit">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select
                    value={editingBrand?.trangThai ?? 1}
                    onChange={(e) =>
                        setEditingBrand({
                          ...editingBrand,
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

export default BrandTable;