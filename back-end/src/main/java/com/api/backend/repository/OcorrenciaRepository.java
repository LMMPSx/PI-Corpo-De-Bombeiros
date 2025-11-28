package com.api.backend.repository;

import com.api.backend.model.OcorrenciaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface OcorrenciaRepository extends JpaRepository<OcorrenciaModel, Integer> {
    List<OcorrenciaModel> findByStatusOcorrencia(String Status);

    List<OcorrenciaModel> findByPrioridadeOcorrencia(String Prioridade);
}
