package com.api.backend.repository;

import com.api.backend.model.StatusOcorrenciaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StatusOcorrenciaRepository extends JpaRepository<StatusOcorrenciaModel, Integer> {
}
