package com.api.backend.repository;

import com.api.backend.model.OcorrenciaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OcorrenciaRepository extends JpaRepository<OcorrenciaModel, Integer> {
    List<OcorrenciaModel> findByDataOcorrenciaBetween(LocalDateTime inicio, LocalDateTime fim);

    List<OcorrenciaModel> findByFkStatusOcorrencia_NomeStatus(String Status);

    List<OcorrenciaModel> findByFkTipoOcorrencia_NomeTipo(String nomeTipo);

    List<OcorrenciaModel> findByFkPrioridadeOcorrencia_NomePrioridade(String nomePrioridade);
}
