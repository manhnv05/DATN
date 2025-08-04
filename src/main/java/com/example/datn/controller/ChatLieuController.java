package com.example.datn.controller;

import com.example.datn.dto.ChatLieuDTO;
import com.example.datn.service.ChatLieuService;
import com.example.datn.vo.chatLieuVO.ChatLieuQueryVO;
import com.example.datn.vo.chatLieuVO.ChatLieuUpdateVO;
import com.example.datn.vo.chatLieuVO.ChatLieuVO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public Page<ChatLieuDTO> query(
            @RequestParam(required = false) Integer id,
            @RequestParam(required = false) String maChatLieu,
            @RequestParam(required = false) String tenChatLieu,
            @RequestParam(required = false) Integer trangThai,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size
    ) {
        ChatLieuQueryVO vO = new ChatLieuQueryVO();
        vO.setId(id);
        vO.setMaChatLieu(maChatLieu);
        vO.setTenChatLieu(tenChatLieu);
        vO.setTrangThai(trangThai);
        vO.setPageNumber(page);
        vO.setPageSize(size);
        return chatLieuService.query(vO);
    }
    @GetMapping("/all")
    public List<ChatLieuDTO> getAll() {
        return chatLieuService.findAll();
    }
}