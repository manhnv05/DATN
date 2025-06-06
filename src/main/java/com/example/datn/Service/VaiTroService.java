package com.example.datn.Service;

import com.example.datn.DTO.VaiTroDTO;
import com.example.datn.Entity.VaiTro;
import com.example.datn.Repository.VaiTroRepository;
import com.example.datn.VO.VaiTroQueryVO;
import com.example.datn.VO.VaiTroUpdateVO;
import com.example.datn.VO.VaiTroVO;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class VaiTroService {

    @Autowired
    private VaiTroRepository vaiTroRepository;

    public Integer save(VaiTroVO vO) {
        VaiTro bean = new VaiTro();
        BeanUtils.copyProperties(vO, bean);
        bean = vaiTroRepository.save(bean);
        return bean.getId();
    }

    public void delete(Integer id) {
        vaiTroRepository.deleteById(id);
    }

    public void update(Integer id, VaiTroUpdateVO vO) {
        VaiTro bean = requireOne(id);
        BeanUtils.copyProperties(vO, bean);
        vaiTroRepository.save(bean);
    }

    public VaiTroDTO getById(Integer id) {
        VaiTro original = requireOne(id);
        return toDTO(original);
    }

    public Page<VaiTroDTO> query(VaiTroQueryVO vO) {
        throw new UnsupportedOperationException();
    }

    private VaiTroDTO toDTO(VaiTro original) {
        VaiTroDTO bean = new VaiTroDTO();
        BeanUtils.copyProperties(original, bean);
        return bean;
    }

    private VaiTro requireOne(Integer id) {
        return vaiTroRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found: " + id));
    }
}
