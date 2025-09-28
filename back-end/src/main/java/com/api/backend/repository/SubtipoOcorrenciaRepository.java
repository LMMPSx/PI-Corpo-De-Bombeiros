package com.api.backend.repository;

import com.api.backend.model.SubtipoOcorrenciaModel;
import com.api.backend.model.TipoOcorrenciaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubtipoOcorrenciaRepository extends JpaRepository<SubtipoOcorrenciaModel, Integer> {
    List<SubtipoOcorrenciaModel> findByNomeSubtipo(String nomeTipo);
}
