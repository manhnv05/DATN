package com.example.datn.Service;

import com.example.datn.DTO.DotGiamGiaDTO;
import com.example.datn.Entity.DotGiamGia;
import com.example.datn.Repository.DotGiamGiaRepository;
import com.example.datn.VO.DotGiamGiaQueryVO;
import com.example.datn.VO.DotGiamGiaUpdateVO;
import com.example.datn.VO.DotGiamGiaVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class DotGiamGiaService {

    @Autowired
    private DotGiamGiaRepository dotGiamGiaRepository;

    public Integer save(DotGiamGiaVO vO) {
        DotGiamGia bean = new DotGiamGia();
        BeanUtils.copyProperties(vO, bean);
        bean = dotGiamGiaRepository.save(bean);
        return bean.getId();
    }

    public void delete(Integer id) {
        dotGiamGiaRepository.deleteById(id);
    }

    public void update(Integer id, DotGiamGiaUpdateVO vO) {
        DotGiamGia bean = requireOne(id);
        BeanUtils.copyProperties(vO, bean);
        dotGiamGiaRepository.save(bean);
    }

    public DotGiamGiaDTO getById(Integer id) {
        DotGiamGia original = requireOne(id);
        return toDTO(original);
    }

    public Page<DotGiamGiaDTO> query(DotGiamGiaQueryVO vO) {
        throw new UnsupportedOperationException();
    }

    private DotGiamGiaDTO toDTO(DotGiamGia original) {
        DotGiamGiaDTO bean = new DotGiamGiaDTO();
        BeanUtils.copyProperties(original, bean);
        return bean;
    }

    private DotGiamGia requireOne(Integer id) {
        return dotGiamGiaRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found: " + id));
    }
}
