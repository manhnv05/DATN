package com.example.datn.Service;

import com.example.datn.DTO.PhieuGiamGiaDTO;
import com.example.datn.Entity.PhieuGiamGia;
import com.example.datn.Repository.PhieuGiamGiaRepository;
import com.example.datn.VO.PhieuGiamGiaQueryVO;
import com.example.datn.VO.PhieuGiamGiaUpdateVO;
import com.example.datn.VO.PhieuGiamGiaVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class PhieuGiamGiaService {

    @Autowired
    private PhieuGiamGiaRepository phieuGiamGiaRepository;

    public Integer save(PhieuGiamGiaVO vO) {
        PhieuGiamGia bean = new PhieuGiamGia();
        BeanUtils.copyProperties(vO, bean);
        bean = phieuGiamGiaRepository.save(bean);
        return bean.getId();
    }

    public void delete(Integer id) {
        phieuGiamGiaRepository.deleteById(id);
    }

    public void update(Integer id, PhieuGiamGiaUpdateVO vO) {
        PhieuGiamGia bean = requireOne(id);
        BeanUtils.copyProperties(vO, bean);
        phieuGiamGiaRepository.save(bean);
    }

    public PhieuGiamGiaDTO getById(Integer id) {
        PhieuGiamGia original = requireOne(id);
        return toDTO(original);
    }

    public Page<PhieuGiamGiaDTO> query(PhieuGiamGiaQueryVO vO) {
        throw new UnsupportedOperationException();
    }

    private PhieuGiamGiaDTO toDTO(PhieuGiamGia original) {
        PhieuGiamGiaDTO bean = new PhieuGiamGiaDTO();
        BeanUtils.copyProperties(original, bean);
        return bean;
    }

    private PhieuGiamGia requireOne(Integer id) {
        return phieuGiamGiaRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found: " + id));
    }
}
