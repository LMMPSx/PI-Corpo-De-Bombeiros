package com.pi.CorpoDeBombeiros.repository;

import com.pi.CorpoDeBombeiros.model.OcorrenciaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface OcorrenciaRepository extends JpaRepository<OcorrenciaModel,Long> {
    List<OcorrenciaModel> findByDataOcorrenciaBetween(LocalDate inicio, LocalDate fim);
    List<OcorrenciaModel> findByStatusOcorrencia(String status);
}
