package com.api.backend.repository;

import com.api.backend.model.AnexosModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnexosRepository extends JpaRepository<AnexosModel, Integer> {

}

