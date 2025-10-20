package com.api.backend.repository;

import com.api.backend.model.TipoOcorrenciaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TipoOcorrenciaRepository extends JpaRepository<TipoOcorrenciaModel, Integer> {

    List<TipoOcorrenciaModel> findByNomeTipo(String nomeTipo);
}
