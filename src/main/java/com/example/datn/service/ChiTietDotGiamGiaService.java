package com.example.datn.service;

import com.example.datn.dto.ChiTietDotGiamGiaDTO;
import com.example.datn.entity.ChiTietDotGiamGia;
import com.example.datn.repository.ChiTietDotGiamGiaRepository;
import com.example.datn.repository.ChiTietSanPhamRepository;
import com.example.datn.repository.DotGiamGiaRepository;
import com.example.datn.entity.DotGiamGia;
import com.example.datn.entity.ChiTietSanPham;
import com.example.datn.vo.chiTietDotGiamGiaVO.ApplyDotGiamGiaVO;
import com.example.datn.vo.chiTietDotGiamGiaVO.ChiTietDotGiamGiaQueryVO;
import com.example.datn.vo.chiTietDotGiamGiaVO.ChiTietDotGiamGiaUpdateVO;
import com.example.datn.vo.chiTietDotGiamGiaVO.ChiTietDotGiamGiaVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class ChiTietDotGiamGiaService {

    @Autowired
    private ChiTietDotGiamGiaRepository chiTietDotGiamGiaRepository;

    @Autowired
    private DotGiamGiaRepository dotGiamGiaRepository;

    @Autowired
    private ChiTietSanPhamRepository chiTietSanPhamRepository;

    public Integer save(ChiTietDotGiamGiaVO vO) {
        ChiTietDotGiamGia bean = new ChiTietDotGiamGia();
        BeanUtils.copyProperties(vO, bean);
        bean = chiTietDotGiamGiaRepository.save(bean);
        return bean.getId();
    }

    public void delete(Integer id) {
        chiTietDotGiamGiaRepository.deleteById(id);
    }

    public void update(Integer id, ChiTietDotGiamGiaUpdateVO vO) {
        ChiTietDotGiamGia bean = requireOne(id);
        BeanUtils.copyProperties(vO, bean);
        chiTietDotGiamGiaRepository.save(bean);
    }

    public ChiTietDotGiamGiaDTO getById(Integer id) {
        ChiTietDotGiamGia original = requireOne(id);
        return toDTO(original);
    }

    public Page<ChiTietDotGiamGiaDTO> query(ChiTietDotGiamGiaQueryVO vO) {
        throw new UnsupportedOperationException();
    }

    /**
     * Lấy danh sách chi tiết đợt giảm giá theo id đợt
     */
    public List<ChiTietDotGiamGiaDTO> findByDotGiamGia(Integer idDotGiamGia) {
        return chiTietDotGiamGiaRepository.findByDotGiamGiaId(idDotGiamGia)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Áp dụng đợt giảm giá cho danh sách sản phẩm chi tiết
     */
    public void applyDotGiamGia(ApplyDotGiamGiaVO vO) {
        DotGiamGia dot = dotGiamGiaRepository.findById(vO.getIdDotGiamGia())
                .orElseThrow(() -> new NoSuchElementException("Dot giam gia not found"));
        List<Integer> ids = vO.getIdSanPhamChiTietList();
        if (ids == null || ids.isEmpty()) {
            return;
        }
        for (Integer idSp : ids) {
            ChiTietSanPham ctsp = chiTietSanPhamRepository.findById(idSp)
                    .orElseThrow(() -> new NoSuchElementException("Chi tiet san pham not found: " + idSp));

            int giaTruoc = ctsp.getGia();
            int giaSau = (int) Math.round(giaTruoc * (1 - dot.getPhanTramGiamGia() / 100.0));

            ChiTietDotGiamGia entity = chiTietDotGiamGiaRepository
                    .findByDotGiamGiaIdAndChiTietSanPhamId(dot.getId(), ctsp.getId())
                    .orElse(new ChiTietDotGiamGia());
            entity.setDotGiamGia(dot);
            entity.setChiTietSanPham(ctsp);
            entity.setGiaTruocKhiGiam(giaTruoc);
            entity.setGiaSauKhiGiam(giaSau);
            entity.setTrangThai(1);
            chiTietDotGiamGiaRepository.save(entity);
        }
    }

    private ChiTietDotGiamGiaDTO toDTO(ChiTietDotGiamGia original) {
        ChiTietDotGiamGiaDTO bean = new ChiTietDotGiamGiaDTO();
        BeanUtils.copyProperties(original, bean);

        if (original.getDotGiamGia() != null) {
            bean.setIdDotGiamGia(original.getDotGiamGia().getId());
        }

        if (original.getChiTietSanPham() != null) {
            bean.setIdSanPhamChiTiet(original.getChiTietSanPham().getId());

            if (original.getChiTietSanPham().getSanPham() != null) {
                bean.setIdSanPham(original.getChiTietSanPham().getSanPham().getId());
            }
        }

        return bean;
    }

    private ChiTietDotGiamGia requireOne(Integer id) {
        return chiTietDotGiamGiaRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found: " + id));
    }
}