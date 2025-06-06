import React, { useState, useEffect } from 'react';
import {
  Table, Button, Form, InputGroup, Pagination, Dropdown, Breadcrumb, Modal
} from 'react-bootstrap';
import { FaPlus, FaQrcode } from 'react-icons/fa';
import axios from '../../axiosConfig';

const CategoryTable = () => {
  const [categoriesData, setCategoriesData] = useState({
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

  const [newCategory, setNewCategory] = useState({
    maDanhMuc: '',
    tenDanhMuc: '',
    trangThai: 1,
  });

  const [editingCategory, setEditingCategory] = useState(null);

  const [queryParams, setQueryParams] = useState({
    page: 0,
    size: 5,
    tenDanhMuc: '',
    trangThai: 'Tất cả'
  });

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { ...queryParams };
      if (params.trangThai === 'Tất cả') {
        delete params.trangThai;
      }
      const response = await axios.get('/danhMuc', { params });
      setCategoriesData(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line
  }, [queryParams]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCategory.maDanhMuc.trim() || !newCategory.tenDanhMuc.trim()) {
      alert('Vui lòng nhập đủ mã và tên danh mục');
      return;
    }
    try {
      await axios.post('/danhMuc', newCategory);
      setShowAddModal(false);
      setNewCategory({
        maDanhMuc: '',
        tenDanhMuc: '',
        trangThai: 1
      });
      fetchCategories();
    } catch (error) {
      console.error('Lỗi khi thêm:', error);
      alert('Có lỗi xảy ra khi thêm danh mục!');
    }
  };

  const handleEditClick = (category) => {
    setEditingCategory({
      id: category.id,
      maDanhMuc: category.maDanhMuc,
      tenDanhMuc: category.tenDanhMuc,
      trangThai: category.trangThai
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingCategory?.maDanhMuc?.trim() || !editingCategory?.tenDanhMuc?.trim()) {
      alert('Vui lòng nhập đủ mã và tên danh mục');
      return;
    }
    try {
      await axios.put(`/danhMuc/${editingCategory.id}`, {
        maDanhMuc: editingCategory.maDanhMuc,
        tenDanhMuc: editingCategory.tenDanhMuc,
        trangThai: editingCategory.trangThai
      });
      setShowEditModal(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
      alert('Có lỗi xảy ra khi cập nhật danh mục!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      try {
        await axios.delete(`/danhMuc/${id}`);
        fetchCategories();
      } catch (error) {
        console.error('Lỗi khi xóa:', error);
        alert('Có lỗi xảy ra khi xóa danh mục!');
      }
    }
  };

  const getTrangThaiText = (trangThai) =>
      trangThai === 1 || trangThai === 'Hiển thị' ? 'Hiển thị' : 'Ẩn';

  return (
      <div style={{ background: '#f5f6fa', minHeight: '100vh', padding: '24px', userSelect: 'none' }}>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Trang Chủ</Breadcrumb.Item>
          <Breadcrumb.Item active>Danh Mục</Breadcrumb.Item>
        </Breadcrumb>

        <div className="bg-white p-3 rounded shadow-sm">
          {/* Top actions */}
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
            {/* Search */}
            <InputGroup style={{ maxWidth: 300 }}>
              <Form.Control
                  placeholder="Tìm danh mục"
                  value={queryParams.tenDanhMuc}
                  onChange={(e) =>
                      setQueryParams({
                        ...queryParams,
                        tenDanhMuc: e.target.value,
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
                Thêm danh mục
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
                ) : categoriesData.content?.length > 0 ? (
                    categoriesData.content.map((category, index) => (
                        <tr key={category.id}>
                          <td>{queryParams.page * queryParams.size + index + 1}</td>
                          <td>{category.maDanhMuc || ''}</td>
                          <td>{category.tenDanhMuc}</td>
                          <td>
                      <span className={`badge ${getTrangThaiText(category.trangThai) === 'Hiển thị' ? 'bg-success' : 'bg-secondary'}`}>
                        {getTrangThaiText(category.trangThai)}
                      </span>
                          </td>
                          <td className="text-center">
                            <Dropdown align="end">
                              <Dropdown.Toggle variant="light" className="rounded-circle border-0">
                                ⋮
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item onClick={() => handleEditClick(category)}>
                                  Sửa
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handleDelete(category.id)}>
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
          {!loading && categoriesData.content?.length > 0 && (
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
                      disabled={categoriesData.first}
                      onClick={() =>
                          setQueryParams({
                            ...queryParams,
                            page: queryParams.page - 1
                          })
                      }
                  />
                  {[...Array(categoriesData.totalPages)].map((_, idx) => (
                      <Pagination.Item
                          key={idx}
                          active={idx === categoriesData.number}
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
                      disabled={categoriesData.last}
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
            <Modal.Title>Thêm danh mục mới</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleAdd}>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="formMaDanhMuc">
                <Form.Label>Mã danh mục</Form.Label>
                <Form.Control
                    required
                    type="text"
                    value={newCategory.maDanhMuc}
                    onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          maDanhMuc: e.target.value
                        })
                    }
                    autoFocus
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formTenDanhMuc">
                <Form.Label>Tên danh mục</Form.Label>
                <Form.Control
                    required
                    type="text"
                    value={newCategory.tenDanhMuc}
                    onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
                          tenDanhMuc: e.target.value
                        })
                    }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formTrangThai">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select
                    value={newCategory.trangThai}
                    onChange={(e) =>
                        setNewCategory({
                          ...newCategory,
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
            <Modal.Title>Sửa danh mục</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleUpdate}>
            <Modal.Body>
              <Form.Group className="mb-3" controlId="formMaDanhMucEdit">
                <Form.Label>Mã danh mục</Form.Label>
                <Form.Control
                    required
                    type="text"
                    value={editingCategory?.maDanhMuc || ''}
                    onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          maDanhMuc: e.target.value
                        })
                    }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formTenDanhMucEdit">
                <Form.Label>Tên danh mục</Form.Label>
                <Form.Control
                    required
                    type="text"
                    value={editingCategory?.tenDanhMuc || ''}
                    onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          tenDanhMuc: e.target.value
                        })
                    }
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formTrangThaiEdit">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select
                    value={editingCategory?.trangThai ?? 1}
                    onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
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

export default CategoryTable;