package com.pi.CorpoDeBombeiros.repository;

import com.pi.CorpoDeBombeiros.model.TipoOcorrenciaModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoOcorrenciaRepository extends JpaRepository<TipoOcorrenciaModel, Integer> {
}
