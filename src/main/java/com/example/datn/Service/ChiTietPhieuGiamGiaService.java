package com.example.datn.Service;

import com.example.datn.DTO.ChiTietPhieuGiamGiaDTO;
import com.example.datn.Entity.ChiTietPhieuGiamGia;
import com.example.datn.Repository.ChiTietPhieuGiamGiaRepository;
import com.example.datn.VO.ChiTietPhieuGiamGiaQueryVO;
import com.example.datn.VO.ChiTietPhieuGiamGiaUpdateVO;
import com.example.datn.VO.ChiTietPhieuGiamGiaVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class ChiTietPhieuGiamGiaService {

    @Autowired
    private ChiTietPhieuGiamGiaRepository chiTietPhieuGiamGiaRepository;

    public Integer save(ChiTietPhieuGiamGiaVO vO) {
        ChiTietPhieuGiamGia bean = new ChiTietPhieuGiamGia();
        BeanUtils.copyProperties(vO, bean);
        bean = chiTietPhieuGiamGiaRepository.save(bean);
        return bean.getId();
    }

    public void delete(Integer id) {
        chiTietPhieuGiamGiaRepository.deleteById(id);
    }

    public void update(Integer id, ChiTietPhieuGiamGiaUpdateVO vO) {
        ChiTietPhieuGiamGia bean = requireOne(id);
        BeanUtils.copyProperties(vO, bean);
        chiTietPhieuGiamGiaRepository.save(bean);
    }

    public ChiTietPhieuGiamGiaDTO getById(Integer id) {
        ChiTietPhieuGiamGia original = requireOne(id);
        return toDTO(original);
    }

    public Page<ChiTietPhieuGiamGiaDTO> query(ChiTietPhieuGiamGiaQueryVO vO) {
        throw new UnsupportedOperationException();
    }

    private ChiTietPhieuGiamGiaDTO toDTO(ChiTietPhieuGiamGia original) {
        ChiTietPhieuGiamGiaDTO bean = new ChiTietPhieuGiamGiaDTO();
        BeanUtils.copyProperties(original, bean);
        return bean;
    }

    private ChiTietPhieuGiamGia requireOne(Integer id) {
        return chiTietPhieuGiamGiaRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found: " + id));
    }
}
