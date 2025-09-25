package com.api.backend.repository;

import com.api.backend.model.SubtipoOcorrenciaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubtipoOcorrenciaRepository extends JpaRepository<SubtipoOcorrenciaModel, Integer> {
}
