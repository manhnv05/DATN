package com.example.datn.Service;

import com.example.datn.DTO.KichThuocDTO;
import com.example.datn.Entity.KichThuoc;
import com.example.datn.Repository.KichThuocRepository;
import com.example.datn.VO.KichThuocQueryVO;
import com.example.datn.VO.KichThuocUpdateVO;
import com.example.datn.VO.KichThuocVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class KichThuocService {

    @Autowired
    private KichThuocRepository kichThuocRepository;

    public Integer save(KichThuocVO vO) {
        KichThuoc bean = new KichThuoc();
        BeanUtils.copyProperties(vO, bean);
        bean = kichThuocRepository.save(bean);
        return bean.getId();
    }

    public void delete(Integer id) {
        kichThuocRepository.deleteById(id);
    }

    public void update(Integer id, KichThuocUpdateVO vO) {
        KichThuoc bean = requireOne(id);
        BeanUtils.copyProperties(vO, bean);
        kichThuocRepository.save(bean);
    }

    public KichThuocDTO getById(Integer id) {
        KichThuoc original = requireOne(id);
        return toDTO(original);
    }

    public Page<KichThuocDTO> query(KichThuocQueryVO vO) {
        int page = vO.getPage() != null ? vO.getPage() : 0;
        int size = vO.getSize() != null ? vO.getSize() : 10;
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        Page<KichThuoc> entities = kichThuocRepository.findAll((root, query, cb) -> {
            var predicates = cb.conjunction();

            if (vO.getMa() != null && !vO.getMa().isEmpty()) {
                predicates = cb.and(predicates,
                        cb.like(cb.lower(root.get("ma")), "%" + vO.getMa().toLowerCase() + "%"));
            }
            if (vO.getTenKichCo() != null && !vO.getTenKichCo().isEmpty()) {
                predicates = cb.and(predicates,
                        cb.like(cb.lower(root.get("tenKichCo")), "%" + vO.getTenKichCo().toLowerCase() + "%"));
            }
            if (vO.getTrangThai() != null) {
                predicates = cb.and(predicates, cb.equal(root.get("trangThai"), vO.getTrangThai()));
            }
            return predicates;
        }, pageable);

        return entities.map(this::toDTO);
    }

    private KichThuocDTO toDTO(KichThuoc original) {
        KichThuocDTO bean = new KichThuocDTO();
        BeanUtils.copyProperties(original, bean);
        return bean;
    }

    private KichThuoc requireOne(Integer id) {
        return kichThuocRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found: " + id));
    }
}