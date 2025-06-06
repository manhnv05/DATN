package com.example.datn.Service;

import com.example.datn.DTO.TayAoDTO;
import com.example.datn.Entity.TayAo;
import com.example.datn.Repository.TayAoRepository;
import com.example.datn.VO.TayAoQueryVO;
import com.example.datn.VO.TayAoUpdateVO;
import com.example.datn.VO.TayAoVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class TayAoService {

    @Autowired
    private TayAoRepository tayAoRepository;

    public Integer save(TayAoVO vO) {
        TayAo bean = new TayAo();
        BeanUtils.copyProperties(vO, bean);
        bean = tayAoRepository.save(bean);
        return bean.getId();
    }

    public void delete(Integer id) {
        tayAoRepository.deleteById(id);
    }

    public void update(Integer id, TayAoUpdateVO vO) {
        TayAo bean = requireOne(id);
        BeanUtils.copyProperties(vO, bean);
        tayAoRepository.save(bean);
    }

    public TayAoDTO getById(Integer id) {
        TayAo original = requireOne(id);
        return toDTO(original);
    }

    public Page<TayAoDTO> query(TayAoQueryVO vO) {
        int page = vO.getPage() != null ? vO.getPage() : 0;
        int size = vO.getSize() != null ? vO.getSize() : 10;
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        Page<TayAo> entities = tayAoRepository.findAll((root, query, cb) -> {
            var predicates = cb.conjunction();

            if (vO.getMa() != null && !vO.getMa().isEmpty()) {
                predicates = cb.and(predicates,
                        cb.like(cb.lower(root.get("ma")), "%" + vO.getMa().toLowerCase() + "%"));
            }
            if (vO.getTenTayAo() != null && !vO.getTenTayAo().isEmpty()) {
                predicates = cb.and(predicates,
                        cb.like(cb.lower(root.get("tenTayAo")), "%" + vO.getTenTayAo().toLowerCase() + "%"));
            }
            if (vO.getTrangThai() != null) {
                predicates = cb.and(predicates, cb.equal(root.get("trangThai"), vO.getTrangThai()));
            }
            if (vO.getId() != null) {
                predicates = cb.and(predicates, cb.equal(root.get("id"), vO.getId()));
            }
            return predicates;
        }, pageable);

        return entities.map(this::toDTO);
    }

    private TayAoDTO toDTO(TayAo original) {
        TayAoDTO bean = new TayAoDTO();
        BeanUtils.copyProperties(original, bean);
        return bean;
    }

    private TayAo requireOne(Integer id) {
        return tayAoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found: " + id));
    }
}