package com.api.backend.repository;

import com.api.backend.model.TipoOcorrenciaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoOcorrenciaRepository extends JpaRepository<TipoOcorrenciaModel, Integer> {
}
