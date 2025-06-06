package com.example.datn.Controller;

import com.example.datn.DTO.ChatLieuDTO;
import com.example.datn.Service.ChatLieuService;
import com.example.datn.VO.ChatLieuQueryVO;
import com.example.datn.VO.ChatLieuUpdateVO;
import com.example.datn.VO.ChatLieuVO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/chatLieu")
public class ChatLieuController {

    @Autowired
    private ChatLieuService chatLieuService;

    @PostMapping
    public String save(@Valid @RequestBody ChatLieuVO vO) {
        return chatLieuService.save(vO).toString();
    }

    @DeleteMapping("/{id}")
    public void delete(@Valid @NotNull @PathVariable("id") Integer id) {
        chatLieuService.delete(id);
    }

    @PutMapping("/{id}")
    public void update(@Valid @NotNull @PathVariable("id") Integer id,
                       @Valid @RequestBody ChatLieuUpdateVO vO) {
        chatLieuService.update(id, vO);
    }

    @GetMapping("/{id}")
    public ChatLieuDTO getById(@Valid @NotNull @PathVariable("id") Integer id) {
        return chatLieuService.getById(id);
    }

    @GetMapping
    public Page<ChatLieuDTO> query(@Valid ChatLieuQueryVO vO) {
        return chatLieuService.query(vO);
    }
}
