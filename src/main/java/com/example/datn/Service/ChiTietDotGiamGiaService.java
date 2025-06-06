package com.example.datn.Service;

import com.example.datn.DTO.ChiTietDotGiamGiaDTO;
import com.example.datn.Entity.ChiTietDotGiamGia;
import com.example.datn.Repository.ChiTietDotGiamGiaRepository;
import com.example.datn.VO.ChiTietDotGiamGiaQueryVO;
import com.example.datn.VO.ChiTietDotGiamGiaUpdateVO;
import com.example.datn.VO.ChiTietDotGiamGiaVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class ChiTietDotGiamGiaService {

    @Autowired
    private ChiTietDotGiamGiaRepository chiTietDotGiamGiaRepository;

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

    private ChiTietDotGiamGiaDTO toDTO(ChiTietDotGiamGia original) {
        ChiTietDotGiamGiaDTO bean = new ChiTietDotGiamGiaDTO();
        BeanUtils.copyProperties(original, bean);
        return bean;
    }

    private ChiTietDotGiamGia requireOne(Integer id) {
        return chiTietDotGiamGiaRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found: " + id));
    }
}
