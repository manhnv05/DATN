import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { STATUS_LIST } from "./Filter";
import Table from "examples/Tables/Table";
import SoftBox from "components/SoftBox";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/airbnb.css";
import useNotify from "./hooks/useNotify";
import instanceAPIMain from "../../configapi";
import { toast } from "react-toastify";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Box from "@mui/material/Box";
import dayjs from "dayjs";

export function debounce(func, timeout = 500) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func(...args);
        }, timeout);
    };
}

export const createDotGiamGia = (payload) =>
    instanceAPIMain.post("/dotGiamGia", payload);

export const applyDotGiamGia = (payload) =>
    instanceAPIMain.post("/chiTietDotGiamGia/apply", payload);

export const getDotGiamGiaById = (id) =>
    instanceAPIMain.get(`/dotGiamGia/${id}`);

export const updateDotGiamGia = (id, payload) =>
    instanceAPIMain.put(`/dotGiamGia/${id}`, payload);

export const getChiTietDotGiamGiaByDot = (idDot) =>
    instanceAPIMain.get(`/chiTietDotGiamGia/by-dot-giam-gia/${idDot}`);

export const getChiTietBySanPham = (idSanPham) =>
    instanceAPIMain.get(`/chiTietSanPham/by-san-pham/${idSanPham}`);

export const searchSanPham = (keyword) =>
    instanceAPIMain.get("/sanPham/search", {
        params: { keyword },
    });

export const getSanPham = (params) =>
    instanceAPIMain.get("/sanPham", { params });

export const getSanPhamById = (id) => instanceAPIMain.get(`/sanPham/${id}`);

export const getImageByChiTiet = (idChiTiet) =>
    instanceAPIMain.get("/hinhAnh", {
        params: { idSanPhamChiTiet: idChiTiet, page: 0, size: 1 },
    });

const formatPrice = (value) =>
    value !== undefined && value !== null ? value.toLocaleString("vi-VN") + " ₫" : "";

const getDiscountPrice = (price, percent) =>
    price !== undefined && price !== null ? price - (price * (Number(percent) || 0)) / 100 : price;

const INIT = {
    trangThai: 1,
    tenDotGiamGia: "",
    phanTramGiamGia: "",
    ngayBatDau: null,
    ngayKetThuc: null,
    dateRange: [],
};

const AddDiscountEventPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const { notify, Notification } = useNotify();

    const {
        reset,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: INIT,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (id) {
                    const res = await getDotGiamGiaById(id);
                    if (res.status === 200) {
                        const payload = res.data || {};
                        reset({
                            tenDotGiamGia: payload.tenDotGiamGia,
                            phanTramGiamGia: payload.phanTramGiamGia,
                            ngayBatDau:payload.ngayBatDau,
                            ngayKetThuc:payload.ngayKetThuc,
                            trangThai: payload.trangThai,
                            dateRange: [payload.ngayBatDau, payload.ngayKetThuc],
                        });
                        setEventId(payload.id);
                        const detailRes = await getChiTietDotGiamGiaByDot(payload.id);
                        if (detailRes.status === 200) {
                            const list = detailRes.data || [];
                            setSelectedDetails(list.map((d) => d.idSanPhamChiTiet));
                            const proIds = Array.from(new Set(list.map((d) => d.idSanPham)));
                            for (const pid of proIds) {
                                const proRes = await getSanPhamById(pid);
                                if (proRes.status === 200) {
                                    setSelectedProducts((pre) => [...pre, proRes.data]);
                                }
                                await fetchDetails(pid);
                            }
                        }
                    }
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
        // eslint-disable-next-line
    }, [id, reset]);

    const discountValue = watch("phanTramGiamGia");

    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [details, setDetails] = useState([]);
    const [selectedDetails, setSelectedDetails] = useState([]);
    const preDetailMap = React.useMemo(() => {
        return details.reduce((acc, item) => {
            if (!acc[item.idSanPham]) acc[item.idSanPham] = [];
            acc[item.idSanPham].push(item.id);
            return acc;
        }, {});
    }, [details]);

    const fetchDetails = async (idSanPham) => {
        try {
            const res = await getChiTietBySanPham(idSanPham);
            if (res.status === 200) {
                const list = res.data || [];
                const detailWithImg = await Promise.all(
                    list.map(async (it) => {
                        try {
                            const imgRes = await getImageByChiTiet(it.id);
                            return {
                                ...it,
                                idSanPham,
                                image: imgRes.data?.content?.[0]?.duongDanAnh || "",
                            };
                        } catch {
                            return { ...it, idSanPham, image: "" };
                        }
                    })
                );
                setDetails((pre) => {
                    const existedIds = new Set(pre.map((d) => d.id));
                    const add = detailWithImg.filter((d) => !existedIds.has(d.id));
                    return [...pre, ...add];
                });
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchProductsList = async () => {
        try {
            const res = await getSanPham({ page: 0, size: 10 });
            if (res.status === 200) {
                const list = res.data?.content || res.data || [];
                setProducts(list);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchProductsList();
    }, []);

    const handleApply = async () => {
        if (!eventId || selectedDetails.length === 0) return;
        try {
            await applyDotGiamGia({
                idDotGiamGia: eventId,
                idSanPhamChiTietList: selectedDetails,
            });
            notify("Áp dụng thành công", "success");
            navigate("/discount-event");
        } catch (e) {
            console.error(e);
            notify("Áp dụng thất bại", "error");
        }
    };
    const debounceRef = useRef(
        debounce(async (value) => {
            if (!value) {
                await fetchProductsList();
                return;
            }
            const res = await searchSanPham(value);
            if (res.status === 200) setProducts(res.data || []);
        }, 500)
    );

    const productColumns = React.useMemo(
        () => [
            {
                name: "checkbox",
                label: "",
                width: "50px",
                align: "center",
                render: (_, row) => (
                    <Checkbox
                        checked={!!selectedProducts.find((p) => p.id === row.id)}
                        onChange={(_, checked) => {
                            if (checked) {
                                if (!selectedProducts.find((p) => p.id === row.id)) {
                                    setSelectedProducts((pre) => [...pre, row]);
                                }
                                fetchDetails(row.id);
                            } else {
                                setSelectedProducts((pre) => pre.filter((p) => p.id !== row.id));
                                setDetails((pre) => pre.filter((d) => d.idSanPham !== row.id));
                                setSelectedDetails((pre) =>
                                    pre.filter((id) => !preDetailMap[row.id]?.includes(id))
                                );
                            }
                        }}
                    />
                ),
            },
            { name: "tenSanPham", label: "Tên", align: "center" },
            { name: "tenDanhMuc", label: "Danh mục", align: "center" },
        ],
        [selectedProducts, details, preDetailMap]
    );

    const selectedColumns = React.useMemo(
        () => [
            {
                name: "checkbox",
                label: "",
                width: "50px",
                align: "center",
                render: (_, row) => (
                    <Checkbox
                        checked={selectedDetails.includes(row.id)}
                        onChange={(_, checked) => {
                            if (checked) {
                                setSelectedDetails((pre) => [...pre, row.id]);
                            } else {
                                setSelectedDetails((pre) => pre.filter((id) => id !== row.id));
                            }
                        }}
                    />
                ),
            },
            {
                name: "image",
                label: "Ảnh",
                width: "80px",
                align: "center",
                render: (v) => (v ? <img src={v} alt="img" width={50} /> : null),
            },
            {
                name: "info",
                label: "Thông tin chung",
                align: "center",
                render: (_, row) => (
                    <SoftBox lineHeight={1.2}>
                        <SoftTypography display="block" variant="button" fontWeight="medium">
                            {row.tenSanPham} - {row.maSanPhamChiTiet}
                        </SoftTypography>
                        <SoftTypography display="block" variant="caption" color="text">
                            Giá sau mã: {formatPrice(getDiscountPrice(row.gia, discountValue))}
                        </SoftTypography>
                        <SoftTypography display="block" variant="caption" color="text">
                            Giá gốc: {formatPrice(row.gia)}
                        </SoftTypography>
                    </SoftBox>
                ),
            },
            {
                name: "detail",
                label: "Chi tiết",
                align: "center",
                render: (_, row) => (
                    <SoftBox lineHeight={1.2}>
                        <SoftTypography display="block" variant="caption" color="text">
                            Kích cỡ: {row.tenKichThuoc}
                        </SoftTypography>
                        <SoftTypography display="block" variant="caption" color="text">
                            Màu sắc: {row.tenMauSac}
                        </SoftTypography>
                    </SoftBox>
                ),
            },
        ],
        [selectedDetails, discountValue]
    );

    const [eventId, setEventId] = useState(id);

    const onSubmit = async (data) => {
        try {
            const [start, end] = data.dateRange || [];
            const payload = {
                tenDotGiamGia: data.tenDotGiamGia,
                phanTramGiamGia: Number(data.phanTramGiamGia),
                ngayBatDau: dayjs(data.ngayBatDau).format('YYYY-MM-DDTHH:mm:ss'),
                ngayKetThuc: dayjs(data.ngayKetThuc).format('YYYY-MM-DDTHH:mm:ss'),
                trangThai: data.trangThai,
            };
            console.log(payload)
            const res = eventId
                ? await updateDotGiamGia(eventId, { ...payload, id: eventId })
                : await createDotGiamGia(payload);
            const idDotGiamGia = eventId || res.data;
            setEventId(idDotGiamGia);
            eventId ? toast.success("Cập nhật thành công") : toast.success("Thêm thành công")
        } catch (e) {
            console.error(e);
            eventId ? toast.success("Cập nhật không thành công") : toast.error("Thêm không thành công")
        }
    };

    const handleReset = () => {
        reset();
        setSelectedProducts([]);
        setDetails([]);
        setSelectedDetails([]);
        setSearch("");
        setProducts([]);
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            {Notification}
            <Stack direction="row" justifyContent="flex-end">
                <Button
                    startIcon={<FaArrowLeft />}
                    onClick={() => {
                        navigate("/discount-event");
                    }}
                >
                    Quay lại
                </Button>
            </Stack>
            <Stack direction="row" spacing={3} mb={3}>
                <Card sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
                    <SoftTypography sx={{ fontWeight: 500 }}>Chỉnh sửa đợt giảm giá</SoftTypography>

                    <Stack
                        spacing={1}
                        component="form"
                        onSubmit={handleSubmit(onSubmit)}
                        sx={{
                            width: 400,
                        }}
                    >
                        <Stack>
                            <InputLabel
                                sx={{
                                    fontWeight: 400,
                                    fontSize: 14,
                                    "& .MuiFormLabel-asterisk": { color: "#CF202F" },
                                }}
                                required
                            >
                                Tên
                            </InputLabel>
                            <Controller
                                name="tenDotGiamGia"
                                control={control}
                                rules={{
                                    required: "Vui lòng nhập tên đợt giảm giá",
                                    maxLength: {
                                        value: 100,
                                        message: "Tên đợt giảm giá không vượt quá 100 ký tự",
                                    },
                                }}
                                render={({ field }) => (
                                    <TextField
                                        id="tenDotGiamGia"
                                        {...field}
                                        error={!!errors.tenDotGiamGia}
                                        helperText={errors.tenDotGiamGia?.message}
                                    />
                                )}
                            />
                        </Stack>
                        <Stack>
                            <InputLabel
                                sx={{
                                    fontWeight: 400,
                                    fontSize: 14,
                                    "& .MuiFormLabel-asterisk": { color: "#CF202F" },
                                }}
                                required
                            >
                                Phần trăm giảm giá
                            </InputLabel>
                            <Controller
                                name="phanTramGiamGia"
                                control={control}
                                rules={{
                                    required: "Vui lòng nhập phần trăm giảm giá",
                                    min: { value: 1, message: "Phần trăm giảm giá phải lớn hơn 0" },
                                    max: {
                                        value: 100,
                                        message: "Phần trăm giảm giá phải nhỏ hơn hoặc bằng 100",
                                    },
                                }}
                                render={({ field }) => (
                                    <TextField
                                        type="number"
                                        id="phanTramGiamGia"
                                        {...field}
                                        error={!!errors.phanTramGiamGia}
                                        helperText={errors.phanTramGiamGia?.message}
                                    />
                                )}
                            />
                        </Stack>
                        <Stack>
                            <InputLabel
                                required
                                sx={{
                                    fontWeight: 400,
                                    fontSize: 14,
                                    "& .MuiFormLabel-asterisk": { color: "#CF202F" },
                                }}
                            >
                                Thời gian áp dụng
                            </InputLabel>
                            <Box display="flex" flexDirection="row" gap={2} mb={2} sx={{ marginTop: 1 }}>
                                <Box sx={{ flex: 1, maxWidth: 190 }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <Controller
                                            name="ngayBatDau"
                                            control={control}
                                            defaultValue={null}
                                            render={({ field }) => (
                                                <DateTimePicker
                                                    label="Ngày bắt đầu"
                                                    renderInput={(props) => (
                                                        <TextField
                                                            {...props}
                                                            fullWidth
                                                            sx={{
                                                                '& .MuiInputBase-root': {
                                                                    fontWeight: 700,
                                                                    color: "#1769aa",
                                                                    background: "#f2f6fa",
                                                                    borderRadius: 2,
                                                                    height: '56px',
                                                                    fontSize: '16px',
                                                                },
                                                                '& .MuiInputBase-input': {
                                                                    padding: '16.5px 14px',
                                                                },
                                                                '& .MuiOutlinedInput-notchedOutline': {
                                                                    border: 'none',
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                    value={field.value}
                                                    onChange={(newValue) => {
                                                        field.onChange(newValue);
                                                    }}
                                                />
                                            )}
                                        />
                                    </LocalizationProvider>
                                </Box>
                                <Box sx={{ flex: 1, maxWidth: 190 }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <Controller
                                            name="ngayKetThuc"
                                            control={control}
                                            defaultValue={null}
                                            render={({ field }) => (
                                                <DateTimePicker
                                                    label="Ngày kết thúc"
                                                    renderInput={(props) => (
                                                        <TextField
                                                            {...props}
                                                            fullWidth
                                                            sx={{
                                                                '& .MuiInputBase-root': {
                                                                    fontWeight: 700,
                                                                    color: "#1769aa",
                                                                    background: "#f2f6fa",
                                                                    borderRadius: 2,
                                                                    height: '56px',
                                                                    fontSize: '16px',
                                                                },
                                                                '& .MuiInputBase-input': {
                                                                    padding: '16.5px 14px',
                                                                },
                                                                '& .MuiOutlinedInput-notchedOutline': {
                                                                    border: 'none',
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                    value={field.value}
                                                    onChange={(newValue) => {
                                                        field.onChange(newValue);
                                                    }}
                                                />
                                            )}
                                        />
                                    </LocalizationProvider>
                                </Box>
                            </Box>
                        </Stack>
                        <Stack>
                            <InputLabel
                                sx={{
                                    fontWeight: 400,
                                    fontSize: 14,
                                    "& .MuiFormLabel-asterisk": { color: "#CF202F" },
                                }}
                            >
                                Trạng thái
                            </InputLabel>
                            <Controller
                                name="trangThai"
                                control={control}
                                render={({ field: { onChange, ...otherFieldProps } }) => (
                                    <Select
                                        onChange={(event, child) => {
                                            onChange(event, child);
                                        }}
                                        {...otherFieldProps}
                                    >
                                        {STATUS_LIST.map((item) => (
                                            <MenuItem key={item.id} value={item.id}>
                                                {item.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                        </Stack>
                        <Stack direction="row" spacing={2} pt={2}>
                            <Button
                                sx={{
                                    width: 90,
                                    px: 0,
                                    textTransform: "unset",
                                }}
                                variant="contained"
                                size="small"
                                type="submit"
                            >
                                {id ? "Lưu" : "Thêm"}
                            </Button>
                            <Button
                                sx={{
                                    width: 90,
                                    px: 0,
                                    textTransform: "unset",
                                }}
                                variant="outlined"
                                size="small"
                                onClick={handleReset}
                            >
                                Clear form
                            </Button>
                        </Stack>
                    </Stack>
                </Card>
                <Card sx={{ p: { xs: 2, md: 3 }, mb: 2, flex: 1 }}>
                    <SoftTypography sx={{ fontWeight: 500 }}>Danh sách sản phẩm</SoftTypography>
                    <Stack spacing={1} mt={1}>
                        <TextField
                            placeholder="Tìm kiếm sản phẩm"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                debounceRef.current(e.target.value);
                            }}
                        />
                        <Table columns={productColumns} rows={products} />
                    </Stack>
                </Card>
            </Stack>
            {details.length > 0 && (
                <Card sx={{ p: { xs: 2, md: 3 }, mb: 2, flex: 1 }}>
                    <SoftTypography sx={{ fontWeight: 500, mt: 2 }}>Sản phẩm chi tiết</SoftTypography>
                    <Table
                        columns={selectedColumns}
                        rows={details.map((item) => ({
                            id: item.id,
                            image: item.image,
                            tenSanPham: item.tenSanPham,
                            maSanPhamChiTiet: item.maSanPhamChiTiet,
                            gia: item.gia,
                            tenMauSac: item.tenMauSac,
                            tenKichThuoc: item.tenKichThuoc,
                        }))}
                    />
                    <Stack direction="row" justifyContent="flex-end" mt={1}>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleApply}
                            disabled={!eventId || selectedDetails.length === 0}
                        >
                            Áp dụng
                        </Button>
                    </Stack>
                </Card>
            )}
        </DashboardLayout>
    );
};

export default AddDiscountEventPage;