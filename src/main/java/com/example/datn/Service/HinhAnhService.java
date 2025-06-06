package com.example.datn.Service;

import com.example.datn.DTO.HinhAnhDTO;
import com.example.datn.Entity.HinhAnh;
import com.example.datn.Entity.ChiTietSanPham;
import com.example.datn.Repository.HinhAnhRepository;
import com.example.datn.Repository.ChiTietSanPhamRepository;
import com.example.datn.VO.HinhAnhQueryVO;
import com.example.datn.VO.HinhAnhUpdateVO;
import com.example.datn.VO.HinhAnhVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class HinhAnhService {

    @Autowired
    private HinhAnhRepository hinhAnhRepository;

    @Autowired
    private ChiTietSanPhamRepository chiTietSanPhamRepository;

    public Integer save(HinhAnhVO vO) {
        HinhAnh bean = new HinhAnh();
        BeanUtils.copyProperties(vO, bean);
        if (vO.getIdSanPhamChiTiet() != null) {
            ChiTietSanPham chiTiet = chiTietSanPhamRepository.findById(vO.getIdSanPhamChiTiet())
                    .orElseThrow(() -> new NoSuchElementException("ChiTietSanPham not found: " + vO.getIdSanPhamChiTiet()));
            bean.setChiTietSanPham(chiTiet);
        } else {
            bean.setChiTietSanPham(null);
        }
        bean = hinhAnhRepository.save(bean);
        return bean.getId();
    }

    public void delete(Integer id) {
        hinhAnhRepository.deleteById(id);
    }

    public void update(Integer id, HinhAnhUpdateVO vO) {
        HinhAnh bean = requireOne(id);
        BeanUtils.copyProperties(vO, bean);
        if (vO.getIdSanPhamChiTiet() != null) {
            ChiTietSanPham chiTiet = chiTietSanPhamRepository.findById(vO.getIdSanPhamChiTiet())
                    .orElseThrow(() -> new NoSuchElementException("ChiTietSanPham not found: " + vO.getIdSanPhamChiTiet()));
            bean.setChiTietSanPham(chiTiet);
        } else {
            bean.setChiTietSanPham(null);
        }
        hinhAnhRepository.save(bean);
    }

    public HinhAnhDTO getById(Integer id) {
        HinhAnh original = requireOne(id);
        return toDTO(original);
    }

    public Page<HinhAnhDTO> query(HinhAnhQueryVO vO) {
        int page = vO.getPage() != null ? vO.getPage() : 0;
        int size = vO.getSize() != null ? vO.getSize() : 10;
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        Specification<HinhAnh> spec = (root, query, cb) -> {
            var predicates = cb.conjunction();
            if (vO.getId() != null) {
                predicates = cb.and(predicates, cb.equal(root.get("id"), vO.getId()));
            }
            if (vO.getIdSanPhamChiTiet() != null) {
                predicates = cb.and(predicates, cb.equal(root.get("chiTietSanPham").get("id"), vO.getIdSanPhamChiTiet()));
            }
            if (vO.getMaAnh() != null && !vO.getMaAnh().isEmpty()) {
                predicates = cb.and(predicates, cb.like(cb.lower(root.get("maAnh")), "%" + vO.getMaAnh().toLowerCase() + "%"));
            }
            if (vO.getDuongDanAnh() != null && !vO.getDuongDanAnh().isEmpty()) {
                predicates = cb.and(predicates, cb.like(cb.lower(root.get("duongDanAnh")), "%" + vO.getDuongDanAnh().toLowerCase() + "%"));
            }
            if (vO.getAnhMacDinh() != null) {
                predicates = cb.and(predicates, cb.equal(root.get("anhMacDinh"), vO.getAnhMacDinh()));
            }
            if (vO.getMoTa() != null && !vO.getMoTa().isEmpty()) {
                predicates = cb.and(predicates, cb.like(cb.lower(root.get("moTa")), "%" + vO.getMoTa().toLowerCase() + "%"));
            }
            if (vO.getTrangThai() != null) {
                predicates = cb.and(predicates, cb.equal(root.get("trangThai"), vO.getTrangThai()));
            }
            return predicates;
        };

        Page<HinhAnh> entities = hinhAnhRepository.findAll(spec, pageable);
        return entities.map(this::toDTO);
    }

    private HinhAnhDTO toDTO(HinhAnh original) {
        HinhAnhDTO bean = new HinhAnhDTO();
        BeanUtils.copyProperties(original, bean);
        // Chuyển đổi idSanPhamChiTiet từ entity sang DTO
        if (original.getChiTietSanPham() != null) {
            bean.setIdSanPhamChiTiet(original.getChiTietSanPham().getId());
        } else {
            bean.setIdSanPhamChiTiet(null);
        }
        return bean;
    }

    private HinhAnh requireOne(Integer id) {
        return hinhAnhRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found: " + id));
    }
}