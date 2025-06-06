package com.example.datn.Repository;

import com.example.datn.Entity.TayAo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface TayAoRepository extends JpaRepository<TayAo, Integer>, JpaSpecificationExecutor<TayAo> {

}