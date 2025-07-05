import { useEffect, useState, useCallback } from "react";
import instanceAPIMain from "../../../configapi";


export const getDotGiamGia = (params) =>
    instanceAPIMain.get("/dotGiamGia", {
      params,
    });

const formatDate = (date) =>
    date ? new Date(date).toISOString().split("T")[0] : undefined;

const useGetDotGiamGia = (initialFilter = {}) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 5,
    totalElements: 0,
    totalPages: 0,
    last: false,
    first: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(initialFilter);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getDotGiamGia({
        page: pagination.page,
        size: pagination.size,
        tenDotGiamGia: filter.tenDotGiamGia,
        trangThai: filter.trangThai,
        ngayBatDau: formatDate(filter.ngayBatDau),
        ngayKetThuc: formatDate(filter.ngayKetThuc),
      });
      if (res.status === 200) {
        const payload = res.data || {};
        setData(payload.content || []);
        setTotal(payload.totalElements || 0);
        setPagination({
          page: payload.number,
          size: payload.size,
          totalElements: payload.totalElements,
          totalPages: payload.totalPages,
          last: payload.last,
          first: payload.first,
        });
      } else {
        throw res;
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [
    filter.tenDotGiamGia,
    filter.trangThai,
    filter.ngayBatDau,
    filter.ngayKetThuc,
    pagination.page,
    pagination.size,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    total,
    pagination,
    loading,
    setPagination,
    error,
    filter,
    setFilter,
    refresh: fetchData,
  };
};

export default useGetDotGiamGia;