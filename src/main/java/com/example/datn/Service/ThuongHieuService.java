package com.example.datn.Service;

import com.example.datn.DTO.ThuongHieuDTO;
import com.example.datn.Entity.ThuongHieu;
import com.example.datn.Repository.ThuongHieuRepository;
import com.example.datn.VO.ThuongHieuQueryVO;
import com.example.datn.VO.ThuongHieuUpdateVO;
import com.example.datn.VO.ThuongHieuVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class ThuongHieuService {

    @Autowired
    private ThuongHieuRepository thuongHieuRepository;

    public Integer save(ThuongHieuVO vO) {
        ThuongHieu entity = new ThuongHieu();
        BeanUtils.copyProperties(vO, entity);
        entity = thuongHieuRepository.save(entity);
        return entity.getId();
    }

    public void delete(Integer id) {
        thuongHieuRepository.deleteById(id);
    }

    public void update(Integer id, ThuongHieuUpdateVO vO) {
        ThuongHieu entity = requireOne(id);
        BeanUtils.copyProperties(vO, entity);
        thuongHieuRepository.save(entity);
    }

    public ThuongHieuDTO getById(Integer id) {
        ThuongHieu original = requireOne(id);
        return toDTO(original);
    }

    // Cập nhật hàm query, giả định ThuongHieuQueryVO có các trường: page, size, tenThuongHieu, maThuongHieu, trangThai
    public Page<ThuongHieuDTO> query(ThuongHieuQueryVO vO) {
        // Nếu ThuongHieuQueryVO null hoặc thiếu field thì cần kiểm tra kỹ
        int page = vO.getPage() != null ? vO.getPage() : 0;
        int size = vO.getSize() != null ? vO.getSize() : 10;
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        // Giả sử lọc đơn giản theo tên, mã, trạng thái
        Page<ThuongHieu> entities = thuongHieuRepository.findAll((root, query, cb) -> {
            var predicates = cb.conjunction();

            if (vO.getTenThuongHieu() != null && !vO.getTenThuongHieu().isEmpty()) {
                predicates = cb.and(predicates,
                        cb.like(cb.lower(root.get("tenThuongHieu")), "%" + vO.getTenThuongHieu().toLowerCase() + "%"));
            }
            if (vO.getMaThuongHieu() != null && !vO.getMaThuongHieu().isEmpty()) {
                predicates = cb.and(predicates,
                        cb.like(cb.lower(root.get("maThuongHieu")), "%" + vO.getMaThuongHieu().toLowerCase() + "%"));
            }
            if (vO.getTrangThai() != null) {
                predicates = cb.and(predicates, cb.equal(root.get("trangThai"), vO.getTrangThai()));
            }
            return predicates;
        }, pageable);

        return entities.map(this::toDTO);
    }

    private ThuongHieuDTO toDTO(ThuongHieu original) {
        ThuongHieuDTO bean = new ThuongHieuDTO();
        BeanUtils.copyProperties(original, bean);
        return bean;
    }

    private ThuongHieu requireOne(Integer id) {
        return thuongHieuRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found: " + id));
    }
}