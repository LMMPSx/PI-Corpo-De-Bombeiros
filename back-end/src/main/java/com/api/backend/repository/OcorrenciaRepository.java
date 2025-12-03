package com.api.backend.repository;

import com.api.backend.model.OcorrenciaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface OcorrenciaRepository extends JpaRepository<OcorrenciaModel, Integer> {

    @Query("SELECT o FROM OcorrenciaModel o JOIN FETCH o.endereco")
    List<OcorrenciaModel> findAllWithEndereco();
    
    List<OcorrenciaModel> findByStatusOcorrencia(String Status);

    List<OcorrenciaModel> findByPrioridadeOcorrencia(String Prioridade);
}
