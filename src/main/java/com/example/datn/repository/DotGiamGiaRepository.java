package com.example.datn.repository;

import com.example.datn.entity.DotGiamGia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.Optional;

public interface DotGiamGiaRepository extends JpaRepository<DotGiamGia, Integer>, JpaSpecificationExecutor<DotGiamGia> {

    Optional<DotGiamGia> findFirstByMaDotGiamGiaStartingWithOrderByMaDotGiamGiaDesc(String prefix);

}