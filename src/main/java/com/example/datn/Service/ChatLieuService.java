package com.example.datn.Service;

import com.example.datn.DTO.ChatLieuDTO;
import com.example.datn.Entity.ChatLieu;
import com.example.datn.Repository.ChatLieuRepository;
import com.example.datn.VO.ChatLieuQueryVO;
import com.example.datn.VO.ChatLieuUpdateVO;
import com.example.datn.VO.ChatLieuVO;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ChatLieuService {

    @Autowired
    private ChatLieuRepository chatLieuRepository;

    public Integer save(ChatLieuVO vO) {
        ChatLieu bean = new ChatLieu();
        BeanUtils.copyProperties(vO, bean);
        bean = chatLieuRepository.save(bean);
        return bean.getId();
    }

    public void delete(Integer id) {
        chatLieuRepository.deleteById(id);
    }

    public void update(Integer id, ChatLieuUpdateVO vO) {
        ChatLieu bean = requireOne(id);
        BeanUtils.copyProperties(vO, bean);
        chatLieuRepository.save(bean);
    }

    public ChatLieuDTO getById(Integer id) {
        ChatLieu original = requireOne(id);
        return toDTO(original);
    }

    public Page<ChatLieuDTO> query(ChatLieuQueryVO vO) {
        Pageable pageable = PageRequest.of(
                vO.getPageNumber() != null ? vO.getPageNumber() : 0,
                vO.getPageSize() != null ? vO.getPageSize() : 10
        );

        Specification<ChatLieu> specification = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (vO.getTenChatLieu() != null && !vO.getTenChatLieu().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("tenChatLieu")),
                        "%" + vO.getTenChatLieu().toLowerCase() + "%"
                ));
            }

            if (vO.getMaChatLieu() != null && !vO.getMaChatLieu().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("maChatLieu")),
                        "%" + vO.getMaChatLieu().toLowerCase() + "%"
                ));
            }

            if (vO.getTrangThai() != null) {
                predicates.add(criteriaBuilder.equal(root.get("trangThai"), vO.getTrangThai()));
            }

            return predicates.isEmpty() ?
                    criteriaBuilder.conjunction() :
                    criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        Page<ChatLieu> chatLieuPage = chatLieuRepository.findAll(specification, pageable);

        return chatLieuPage.map(this::toDTO);
    }

    private ChatLieuDTO toDTO(ChatLieu original) {
        ChatLieuDTO bean = new ChatLieuDTO();
        BeanUtils.copyProperties(original, bean);
        return bean;
    }

    private ChatLieu requireOne(Integer id) {
        return chatLieuRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Resource not found: " + id));
    }
}