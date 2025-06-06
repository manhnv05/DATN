package com.example.datn.Repository;

import com.example.datn.Entity.ChatLieu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface ChatLieuRepository extends JpaRepository<ChatLieu, Integer>, JpaSpecificationExecutor<ChatLieu> {
    Optional<ChatLieu> findByMaChatLieu(String maChatLieu);
}