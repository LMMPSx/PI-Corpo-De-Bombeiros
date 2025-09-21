package com.pi.CorpoDeBombeiros.repository;

import com.pi.CorpoDeBombeiros.model.TipoArquivoModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TipoArquivoRepository extends JpaRepository<TipoArquivoModel, Long> {
}
