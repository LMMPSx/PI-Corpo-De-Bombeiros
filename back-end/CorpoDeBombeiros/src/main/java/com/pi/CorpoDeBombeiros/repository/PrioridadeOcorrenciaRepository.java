package com.pi.CorpoDeBombeiros.repository;

import com.pi.CorpoDeBombeiros.model.PrioridadeOcorrenciaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrioridadeOcorrenciaRepository extends JpaRepository<PrioridadeOcorrenciaModel, Integer> {
}
