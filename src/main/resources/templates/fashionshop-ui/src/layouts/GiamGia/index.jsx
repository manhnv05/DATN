import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useState } from "react";
import Filter from "./Filter";
import TableList from "./TableList";
import useGetDotGiamGia from "./hooks/useGetDotGiamGia";
import { useNavigate } from "react-router-dom";
import useNotify from "./hooks/useNotify";
import ConfirmDialog from "./ConfirmDialog";
import instanceAPIMain from "../../configapi";
import { toast } from "react-toastify";

export const updateDotGiamGia = (id, payload) =>
  instanceAPIMain.put(`/dotGiamGia/${id}`, payload);

export const deleteDotGiamGia = (id) =>
  instanceAPIMain.delete(`/dotGiamGia/${id}`);

const DisCountEvent = () => {
  const {
    data,
    total,
    loading,
    filter,
    pagination,
    setFilter,
    setPagination,
    refresh,
  } = useGetDotGiamGia({
    page: 0,
    size: 5,
  });
  const navigate = useNavigate();
  // Bỏ useNotify, dùng toast thay thế hoàn toàn
  // const { notify, Notification } = useNotify();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loadingDel, setLoadingDel] = useState(false);

  const handleEdit = (row) => {
    navigate(`/discount-event/add?id=${row.id}`);
  };

  const handleView = (row) => {
    navigate(`/discount-event/view?id=${row.id}`);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoadingDel(true);
      await deleteDotGiamGia(deleteId);
      toast.success("Xóa thành công");
      refresh();
    } catch (e) {
      toast.error("Xóa thất bại");
    } finally {
      setLoadingDel(false);
      setShowDeleteDialog(false);
      setDeleteId(null);
    }
  };

  const handleStatusChange = async (row, value) => {
    try {
      await updateDotGiamGia(row.id, { ...row, trangThai: value });
      if (value == 1) {
        toast.success("Đổi trạng thái thành thành công, Đang diễn ra")
      }
      else if (value == 3) {
        toast.success("Đổi trạng thái thành thành công, Tạm dừng")
      }
      else if (value == 4) {
        toast.success("Đổi trạng thái thành thành công, Kết thúc")
      }
      else{
        toast.success("Cập nhật thành công");
      }
      refresh();
    } catch (e) {
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Filter filter={filter} setFilter={setFilter} />
      <TableList
        data={data}
        loading={loading}
        pagination={pagination}
        setPagination={setPagination}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />
      <ConfirmDialog
        open={showDeleteDialog}
        title="Bạn chắc chắn muốn xóa đợt giảm giá này?"
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        loading={loadingDel}
      />
    </DashboardLayout>
  );
};

export default DisCountEvent;