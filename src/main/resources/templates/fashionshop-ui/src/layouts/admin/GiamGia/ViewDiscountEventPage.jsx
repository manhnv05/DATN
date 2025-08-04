import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { STATUS_LIST } from "./Filter";
import Table from "examples/Tables/Table";
import SoftBox from "components/SoftBox";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/airbnb.css";
import { format } from "date-fns";
import instanceAPIMain from "../../../configapi";


export const getImageByChiTiet = (idChiTiet) =>
    instanceAPIMain.get("/hinhAnh", {
        params: { idSanPhamChiTiet: idChiTiet, page: 0, size: 1 },
    });

export const getSanPhamById = (id) => instanceAPIMain.get(`/sanPham/${id}`);

export const getChiTietDotGiamGiaByDot = (idDot) =>
    instanceAPIMain.get(`/chiTietDotGiamGia/by-dot-giam-gia/${idDot}`);

export const getDotGiamGiaById = (id) =>
    instanceAPIMain.get(`/dotGiamGia/${id}`);

export const getChiTietBySanPham = (idSanPham) =>
    instanceAPIMain.get(`/chiTietSanPham/by-san-pham/${idSanPham}`);

const formatPrice = (value) =>
    value !== undefined && value !== null ? value.toLocaleString("vi-VN") + " ₫" : "";

const getDiscountPrice = (price, percent) =>
    price !== undefined && price !== null ? price - (price * (Number(percent) || 0)) / 100 : price;

const ViewDiscountEventPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    const [info, setInfo] = useState({
        tenDotGiamGia: "",
        phanTramGiamGia: "",
        trangThai: 1,
        dateRange: [],
    });
    const [details, setDetails] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                const res = await getDotGiamGiaById(id);
                if (res.status === 200) {
                    const payload = res.data || {};
                    setInfo({
                        tenDotGiamGia: payload.tenDotGiamGia,
                        phanTramGiamGia: payload.phanTramGiamGia,
                        trangThai: payload.trangThai,
                        dateRange: [payload.ngayBatDau, payload.ngayKetThuc],
                    });
                    const detailRes = await getChiTietDotGiamGiaByDot(payload.id);
                    if (detailRes.status === 200) {
                        const list = detailRes.data || [];
                        const proIds = Array.from(new Set(list.map((d) => d.idSanPham)));
                        for (const pid of proIds) {
                            const proRes = await getSanPhamById(pid);
                            if (proRes.status === 200) {
                                await fetchDetails(pid, list);
                            }
                        }
                    }
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchData();
    }, [id]);

    const fetchDetails = async (idSanPham, detailList) => {
        try {
            const res = await getChiTietBySanPham(idSanPham);
            if (res.status === 200) {
                const list = res.data || [];
                const filtered = list.filter((it) => detailList.some((d) => d.idSanPhamChiTiet === it.id));
                const detailWithImg = await Promise.all(
                    filtered.map(async (it) => {
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

    const detailColumns = [
        {
            name: "stt",
            label: "STT",
            width: "10px",
            align: "center",
            render: (_, __, index) => (
                <span style={{ fontSize: "14px", fontWeight: 500, fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif" }}>
                    {index + 1}
                </span>
            ),
        },
        {
            name: "image",
            label: "Ảnh",
            align: "center",
            width: "80px",
            render: (v) => (v ? <img src={v} alt="img" width={50} /> : null),
        },
        {
            name: "info",
            label: "Thông tin chung",
            align: "center",
            render: (_, row) => (
                <SoftBox lineHeight={1.4}>
                    <SoftTypography
                        display="block"
                        sx={{ fontSize: 13, fontWeight: 500 }}>
                        {row.tenSanPham} - {row.maSanPhamChiTiet}
                    </SoftTypography>
                    <SoftTypography display="block"
                                    sx={{ fontSize: 12, color: "#666" }}>
                        Giá sau mã: {formatPrice(getDiscountPrice(row.gia, info.phanTramGiamGia))}
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
    ];

    const rows = details.map((item) => ({
        id: item.id,
        image: item.image,
        tenSanPham: item.tenSanPham,
        maSanPhamChiTiet: item.maSanPhamChiTiet,
        gia: item.gia,
        tenMauSac: item.tenMauSac,
        tenKichThuoc: item.tenKichThuoc,
    }));

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Stack direction="row" justifyContent="flex-end">
                <Button startIcon={<FaArrowLeft />} onClick={() => navigate("/discount-event")}>
                    Quay lại
                </Button>
            </Stack>
            <Stack direction="row" spacing={3} mb={3}>
                <Card sx={{ p: { xs: 2, md: 3 }, mb: 2 }}>
                    <SoftTypography sx={{ fontWeight: 600 }}>Chi tiết đợt giảm giá</SoftTypography>
                    <Stack spacing={1} sx={{ width: 400 }}>
                        <Stack>
                            <InputLabel required sx={{ fontSize: "0.85rem", fontWeight: 400 }}>Tên</InputLabel>
                            <TextField value={info.tenDotGiamGia} InputProps={{ readOnly: true }} disabled />
                        </Stack>
                        <Stack>
                            <InputLabel required sx={{ fontSize: "0.85rem", fontWeight: 400 }}>Phần trăm giảm giá</InputLabel>
                            <TextField
                                type="number"
                                value={info.phanTramGiamGia}
                                InputProps={{ readOnly: true }}
                                disabled
                            />
                        </Stack>
                        <Stack>
                            <InputLabel required sx={{ fontSize: "0.85rem", fontWeight: 400 }}>Thời gian áp dụng</InputLabel>
                            <Flatpickr
                                options={{ mode: "range",
                                    enableTime: true, dateFormat: "Y-m-d H:i",
                                    time_24hr: true,
                                    allowInput: true, }}
                                value={info.dateRange}
                                render={(props, ref) => {
                                    const value = info.dateRange || [];
                                    const displayText =
                                        value.length === 2
                                            ? `${format(new Date(value[0]), "dd/MM/yyyy HH:mm")}  ➝  ${format(
                                                new Date(value[1]),
                                                "dd/MM/yyyy HH:mm"
                                            )}`
                                            : "";

                                    return (
                                        <TextField
                                            inputRef={ref}
                                            value={displayText}
                                            fullWidth
                                            InputProps={{
                                                readOnly: true,
                                                sx: { fontSize: "1rem", fontWeight: 500 },
                                            }}
                                            disabled
                                        />
                                    );
                                }}
                            />
                        </Stack>
                        <Stack>
                            <InputLabel required sx={{ fontSize: "0.85rem", fontWeight: 400 }}>Trạng thái</InputLabel>
                            <Select value={info.trangThai} disabled>
                                {STATUS_LIST.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Stack>
                    </Stack>
                </Card>
                {rows.length > 0 && (
                    <Card sx={{ p: { xs: 2, md: 3 }, mb: 2, flex: 1 }}>
                        <SoftTypography sx={{ fontWeight: 500, mt: 2 }}>Sản phẩm chi tiết</SoftTypography>
                        <Table columns={detailColumns} rows={rows} />
                    </Card>
                )}
            </Stack>
        </DashboardLayout>
    );
};

export default ViewDiscountEventPage;