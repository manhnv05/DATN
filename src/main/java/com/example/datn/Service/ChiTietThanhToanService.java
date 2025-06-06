package com.example.datn.Service;

import com.example.datn.DTO.ChiTietThanhToanDTO;
import com.example.datn.Entity.ChiTietThanhToan;
import com.example.datn.Repository.ChiTietThanhToanRepository;
import com.example.datn.VO.ChiTietThanhToanQueryVO;
import com.example.datn.VO.ChiTietThanhToanUpdateVO;
import com.example.datn.VO.ChiTietThanhToanVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class ChiTietThanhToanService {

    @Autowired
    private ChiTietThanhToanRepository chiTietThanhToanRepository;

    public Integer save(ChiTietThanhToanVO vO) {
        ChiTietThanhToan bean = new ChiTietThanhToan();
        BeanUtils.copyProperties(vO, bean);
        bean = chiTietThanhToanRepository.save(bean);
        return bean.getId();
    }

    public void delete(Integer id) {
        chiTietThanhToanRepository.deleteById(id);
    }

    public void update(Integer id, ChiTietThanhToanUpdateVO vO) {
        ChiTietThanhToan bean = requireOne(id);
        BeanUtils.copyProperties(vO, bean);
        chiTietThanhToanRepository.save(bean);
    }

    public ChiTietThanhToanDTO getById(Integer id) {
        ChiTietThanhToan original = requireOne(id);
        return toDTO(original);
    }

    public Page<ChiTietThanhToanDTO> query(ChiTietThanhToanQueryVO vO) {
        throw new UnsupportedOperationException();
    }

    private ChiTietThanhToanDTO toDTO(ChiTietThanhToan original) {
        ChiTietThanhToanDTO bean = new ChiTietThanhToanDTO();
        BeanUtils.copyProperties(original, bean);
        return bean;
    }

    private ChiTietThanhToan requireOne(Integer id) {
        return chiTietThanhToanRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found: " + id));
    }
}
