package com.pi.CorpoDeBombeiros.repository;

import com.pi.CorpoDeBombeiros.model.StatusOcorrenciaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StatusOcorrenciaRepository extends JpaRepository<StatusOcorrenciaModel, Integer> {
}
