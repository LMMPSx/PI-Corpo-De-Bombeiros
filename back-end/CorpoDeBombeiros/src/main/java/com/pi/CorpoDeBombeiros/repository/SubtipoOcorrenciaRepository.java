package com.pi.CorpoDeBombeiros.repository;

import com.pi.CorpoDeBombeiros.model.SubtipoOcorrenciaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubtipoOcorrenciaRepository extends JpaRepository<SubtipoOcorrenciaModel, Long> {
}
