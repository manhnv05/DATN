package com.example.datn.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "chat_lieu")
public class ChatLieu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "ma_chat_lieu", length = 50)
    private String maChatLieu;

    @Column(name = "ten_chat_lieu", length = 50)
    private String tenChatLieu;

    @Column(name = "trang_thai")
    private Integer trangThai;

    @OneToMany(mappedBy = "chatLieu")
    @ToString.Exclude
    private List<ChiTietSanPham> chiTietSanPhams;
}