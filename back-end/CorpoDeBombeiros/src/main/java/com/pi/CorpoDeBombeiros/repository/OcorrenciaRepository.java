package com.pi.CorpoDeBombeiros.repository;

import com.pi.CorpoDeBombeiros.model.OcorrenciaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OcorrenciaRepository extends JpaRepository<OcorrenciaModel, Integer> {
    List<OcorrenciaModel> findByDataOcorrenciaBetween(LocalDateTime inicio, LocalDateTime fim);

    List<OcorrenciaModel> findByFkStatusOcorrencia_NomeStatus(String Status);
}
