package com.example.datn.Repository;

import com.example.datn.Entity.CoAo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface CoAoRepository extends JpaRepository<CoAo, Integer>, JpaSpecificationExecutor<CoAo> {

}