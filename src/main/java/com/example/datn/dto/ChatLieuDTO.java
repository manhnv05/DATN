package com.example.datn.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class ChatLieuDTO implements Serializable {
    private Integer id;
    private String maChatLieu;
    private String tenChatLieu;
    private Integer trangThai;
}