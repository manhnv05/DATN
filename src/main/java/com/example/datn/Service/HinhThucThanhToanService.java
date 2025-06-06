package com.example.datn.Service;

import com.example.datn.DTO.HinhThucThanhToanDTO;
import com.example.datn.Entity.HinhThucThanhToan;
import com.example.datn.Repository.HinhThucThanhToanRepository;
import com.example.datn.VO.HinhThucThanhToanQueryVO;
import com.example.datn.VO.HinhThucThanhToanUpdateVO;
import com.example.datn.VO.HinhThucThanhToanVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class HinhThucThanhToanService {

    @Autowired
    private HinhThucThanhToanRepository hinhThucThanhToanRepository;

    public Integer save(HinhThucThanhToanVO vO) {
        HinhThucThanhToan bean = new HinhThucThanhToan();
        BeanUtils.copyProperties(vO, bean);
        bean = hinhThucThanhToanRepository.save(bean);
        return bean.getId();
    }

    public void delete(Integer id) {
        hinhThucThanhToanRepository.deleteById(id);
    }

    public void update(Integer id, HinhThucThanhToanUpdateVO vO) {
        HinhThucThanhToan bean = requireOne(id);
        BeanUtils.copyProperties(vO, bean);
        hinhThucThanhToanRepository.save(bean);
    }

    public HinhThucThanhToanDTO getById(Integer id) {
        HinhThucThanhToan original = requireOne(id);
        return toDTO(original);
    }

    public Page<HinhThucThanhToanDTO> query(HinhThucThanhToanQueryVO vO) {
        throw new UnsupportedOperationException();
    }

    private HinhThucThanhToanDTO toDTO(HinhThucThanhToan original) {
        HinhThucThanhToanDTO bean = new HinhThucThanhToanDTO();
        BeanUtils.copyProperties(original, bean);
        return bean;
    }

    private HinhThucThanhToan requireOne(Integer id) {
        return hinhThucThanhToanRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found: " + id));
    }
}
