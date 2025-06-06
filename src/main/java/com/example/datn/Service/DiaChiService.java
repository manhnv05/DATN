package com.example.datn.Service;

import com.example.datn.DTO.DiaChiDTO;
import com.example.datn.Entity.DiaChi;
import com.example.datn.Repository.DiaChiRepository;
import com.example.datn.VO.DiaChiQueryVO;
import com.example.datn.VO.DiaChiUpdateVO;
import com.example.datn.VO.DiaChiVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class DiaChiService {

    @Autowired
    private DiaChiRepository diaChiRepository;

    public Integer save(DiaChiVO vO) {
        DiaChi bean = new DiaChi();
        BeanUtils.copyProperties(vO, bean);
        bean = diaChiRepository.save(bean);
        return bean.getId();
    }

    public void delete(Integer id) {
        diaChiRepository.deleteById(id);
    }

    public void update(Integer id, DiaChiUpdateVO vO) {
        DiaChi bean = requireOne(id);
        BeanUtils.copyProperties(vO, bean);
        diaChiRepository.save(bean);
    }

    public DiaChiDTO getById(Integer id) {
        DiaChi original = requireOne(id);
        return toDTO(original);
    }

    public Page<DiaChiDTO> query(DiaChiQueryVO vO) {
        throw new UnsupportedOperationException();
    }

    private DiaChiDTO toDTO(DiaChi original) {
        DiaChiDTO bean = new DiaChiDTO();
        BeanUtils.copyProperties(original, bean);
        return bean;
    }

    private DiaChi requireOne(Integer id) {
        return diaChiRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found: " + id));
    }
}
