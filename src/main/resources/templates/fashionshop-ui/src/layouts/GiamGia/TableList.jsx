import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import Table from "examples/Tables/Table";
import React, { memo, useMemo } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import PropTypes from "prop-types";
import { STATUS_LIST } from "./Filter";

const TableList = ({
                       data,
                       loading,
                       pagination,
                       setPagination,
                       onView,
                       onEdit,
                       onDelete,
                       onStatusChange,
                   }) => {
    const rows = useMemo(() => data.map((item, index) => ({ stt: index + 1, ...item })), [data]);
    const handlePageChange = (newPage) => {
        setPagination((pre) => ({ ...pre, page: newPage }));
    };

    const columns = [
        { name: "stt", label: "STT", align: "center", width: "60px" },
        { name: "maDotGiamGia", label: "Mã", align: "center", width: "100px" },
        { name: "tenDotGiamGia", label: "Tên", align: "center", width: "180px" },
        { name: "phanTramGiamGia", label: "% giảm", align: "center", width: "80px" },
        { name: "ngayBatDau", label: "Bắt đầu", align: "center", width: "100px" },
        { name: "ngayKetThuc", label: "Kết thúc", align: "center", width: "100px" },
        {
            name: "trangThai",
            label: "Trạng thái",
            align: "center",
            width: "120px",
            render: (value, row) => (
                <Select
                    value={value}
                    size="small"
                    onChange={(e) => onStatusChange(row, Number(e.target.value))}
                >
                    {STATUS_LIST.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                            {item.label}
                        </MenuItem>
                    ))}
                </Select>
            ),
        },
        {
            name: "actions",
            label: "Hành động",
            align: "center",
            width: "110px",
            render: (_, row) => (
                <SoftBox display="flex" gap={0.5} justifyContent="center">
                    <IconButton
                        size="small"
                        sx={{ color: "#4acbf2" }}
                        title="Xem chi tiết"
                        onClick={() => onView(row)}
                    >
                        <FaEye />
                    </IconButton>
                    <IconButton
                        size="small"
                        sx={{ color: "#4acbf2" }}
                        title="Sửa"
                        onClick={() => onEdit(row)}
                    >
                        <FaEdit />
                    </IconButton>
                    <IconButton
                        size="small"
                        sx={{ color: "#4acbf2" }}
                        title="Xóa"
                        onClick={() => onDelete(row.id)}
                    >
                        <FaTrash />
                    </IconButton>
                </SoftBox>
            ),
        },
    ];

    return (
        <Card sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
            <SoftTypography sx={{ fontWeight: 500, mb: 2 }}>Danh sách đợt giảm giá</SoftTypography>
            <Table columns={columns} rows={rows} loading={loading} />
            <Stack
                mt={2}
                direction="row"
                sx={{
                    justifyContent: "space-between",
                }}
            >
                <Select
                    sx={{
                        width: "110px !important",
                    }}
                    value={pagination.size}
                    onChange={(e) =>
                        setPagination((pre) => ({
                            ...pre,
                            size: Number(e.target.value),
                            page: 0,
                        }))
                    }
                    size="small"
                >
                    {[5, 10, 20].map((n) => (
                        <MenuItem key={n} value={n}>
                            Hiển thị {n}
                        </MenuItem>
                    ))}
                </Select>
                <SoftBox display="flex" alignItems="center" gap={1}>
                    <Button
                        variant="text"
                        size="small"
                        disabled={pagination.first}
                        onClick={() => handlePageChange(pagination.page - 1)}
                        sx={{ color: pagination.first ? "#bdbdbd" : "#49a3f1" }}
                    >
                        Trước
                    </Button>
                    {Array.from({ length: pagination.totalPages || 1 }, (_, i) => (
                        <Button
                            key={i + 1}
                            variant={pagination.page === i ? "contained" : "text"}
                            color={pagination.page === i ? "info" : "inherit"}
                            size="small"
                            onClick={() => handlePageChange(i)}
                            sx={{
                                minWidth: 32,
                                borderRadius: 2,
                                color: pagination.page === i ? "#fff" : "#495057",
                                background: pagination.page === i ? "#49a3f1" : "transparent",
                            }}
                        >
                            {i + 1}
                        </Button>
                    ))}
                    <Button
                        variant="text"
                        size="small"
                        disabled={pagination.last}
                        onClick={() => handlePageChange(pagination.page + 1)}
                        sx={{ color: pagination.last ? "#bdbdbd" : "#49a3f1" }}
                    >
                        Sau
                    </Button>
                </SoftBox>
            </Stack>
        </Card>
    );
};

export default memo(TableList);

TableList.propTypes = {
    data: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    pagination: PropTypes.object,
    setPagination: PropTypes.func,
    onView: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onStatusChange: PropTypes.func,
};