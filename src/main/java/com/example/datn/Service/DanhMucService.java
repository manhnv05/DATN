package com.example.datn.Service;

import com.example.datn.DTO.DanhMucDTO;
import com.example.datn.Entity.DanhMuc;
import com.example.datn.Repository.DanhMucRepository;
import com.example.datn.VO.DanhMucQueryVO;
import com.example.datn.VO.DanhMucUpdateVO;
import com.example.datn.VO.DanhMucVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class DanhMucService {

    @Autowired
    private DanhMucRepository danhMucRepository;

    public Integer save(DanhMucVO vO) {
        DanhMuc bean = new DanhMuc();
        BeanUtils.copyProperties(vO, bean);
        bean = danhMucRepository.save(bean);
        return bean.getId();
    }

    public void delete(Integer id) {
        danhMucRepository.deleteById(id);
    }

    public void update(Integer id, DanhMucUpdateVO vO) {
        DanhMuc bean = requireOne(id);
        BeanUtils.copyProperties(vO, bean);
        danhMucRepository.save(bean);
    }

    public DanhMucDTO getById(Integer id) {
        DanhMuc original = requireOne(id);
        return toDTO(original);
    }

    // Đã cài đặt phân trang và lọc theo các trường truy vấn
    public Page<DanhMucDTO> query(DanhMucQueryVO vO) {
        int page = vO.getPage() != null ? vO.getPage() : 0;
        int size = vO.getSize() != null ? vO.getSize() : 10;
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        Page<DanhMuc> entities = danhMucRepository.findAll((root, query, cb) -> {
            var predicates = cb.conjunction();

            if (vO.getTenDanhMuc() != null && !vO.getTenDanhMuc().isEmpty()) {
                predicates = cb.and(predicates,
                        cb.like(cb.lower(root.get("tenDanhMuc")), "%" + vO.getTenDanhMuc().toLowerCase() + "%"));
            }
            if (vO.getMaDanhMuc() != null && !vO.getMaDanhMuc().isEmpty()) {
                predicates = cb.and(predicates,
                        cb.like(cb.lower(root.get("maDanhMuc")), "%" + vO.getMaDanhMuc().toLowerCase() + "%"));
            }
            if (vO.getTrangThai() != null) {
                predicates = cb.and(predicates, cb.equal(root.get("trangThai"), vO.getTrangThai()));
            }
            return predicates;
        }, pageable);

        return entities.map(this::toDTO);
    }

    private DanhMucDTO toDTO(DanhMuc original) {
        DanhMucDTO bean = new DanhMucDTO();
        BeanUtils.copyProperties(original, bean);
        return bean;
    }

    private DanhMuc requireOne(Integer id) {
        return danhMucRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found: " + id));
    }
}